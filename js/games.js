// ==========================================
// RageCore - Game Catalog
// ==========================================

// Elements
const gamesContainer = document.getElementById("gamesContainer");
const gameCount = document.getElementById("gameCount");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");
const sortFilter = document.getElementById("sortFilter");

// Store filtered games
let filteredGames = [];

// ==========================================
// Display Games
// ==========================================

function displayGames(gameList) {

    gamesContainer.innerHTML = "";

    gameCount.textContent = `Showing ${gameList.length} Games`;

    if (gameList.length === 0) {

        gamesContainer.innerHTML = `
            <h2 class="no-games">
                No Games Found
            </h2>
        `;

        return;

    }

    gameList.forEach(game => {

        const gameCard = document.createElement("a");

        const gamePages = {
            "Forza Horizon 5": "forza.html",
            "Grand Theft Auto V": "gta.html",
            "Black Myth: Wukong": "wukong.html",
            "Cyberpunk 2077": "cyber.html",
            "Elden Ring": "elden-ring.html",
            "EA FC 26": "ec.html",
            "Minecraft": "minecraft.html",
            "Valorant": "valorant.html",
            "PUBG: Battlegrounds": "pubg.html",
            "Assassin's Creed Shadows": "as.html",
            "Red Dead Redemption 2": "rdr2.html",
            "Call of Duty: Black Ops 7": "cod.html"
        };

        gameCard.href = gamePages[game.title] || "#";

        gameCard.className = "game-card";

        gameCard.style.textDecoration = "none";
        gameCard.style.color = "inherit";

        gameCard.innerHTML = `

            <div class="card">

                <div class="card-image">

                    <img
                        src="${game.image}"
                        alt="${game.title}"
                        class="game-image"
                    >

                    ${game.discount > 0 ? `
                        <span class="discount-badge">
                            ${game.discount}% OFF
                        </span>
                    ` : ""}

                    ${game.featured ? `
                        <span class="featured-badge">
                            ⭐ Featured
                        </span>
                    ` : ""}

                    ${game.trending ? `
                        <span class="trending-badge">
                            🔥 Trending
                        </span>
                    ` : ""}

                </div>

                <div class="game-info">

                    <span class="badge">
                        ${game.category}
                    </span>

                    <h3>
                        ${game.title}
                    </h3>

                    <p class="rating">
                        ⭐ ${game.rating}
                    </p>

                    ${game.price === 0
                ? `
                            <h4 class="free-price">
                                Free
                            </h4>
                        `
                : `
                            <div class="price-box">

                                ${game.originalPrice > game.price
                    ? `
                                        <span class="original-price">
                                            ₹${game.originalPrice.toLocaleString()}
                                        </span>
                                    `
                    : ""
                }

                                <h4 class="current-price">
                                    ₹${game.price.toLocaleString()}
                                </h4>

                            </div>
                        `
            }

                    <button class="btn btn-primary">
                        View Details
                    </button>

                </div>

            </div>

        `;

        gamesContainer.appendChild(gameCard);

    });

}

// ==========================================
// Search + Filter + Sort
// ==========================================

function applyFilters() {

    let result = [...games];

    // Search
    const searchValue = searchInput.value
        .toLowerCase()
        .trim();

    if (searchValue !== "") {

        result = result.filter(game =>
            game.title
                .toLowerCase()
                .includes(searchValue)
        );

    }

    // Category
    const category = categoryFilter.value;

    if (category !== "all") {

        result = result.filter(game =>
            game.category === category
        );

    }

    // Price
    const price = priceFilter.value;

    if (price === "free") {

        result = result.filter(game =>
            game.price === 0
        );

    }

    else if (price === "2000") {

        result = result.filter(game =>
            game.price < 2000
        );

    }

    else if (price === "3000") {

        result = result.filter(game =>
            game.price < 3000
        );

    }

    else if (price === "5000") {

        result = result.filter(game =>
            game.price >= 3000
        );

    }

    // ==========================================
    // Sorting
    // ==========================================

    const sort = sortFilter.value;

    switch (sort) {

        case "priceLow":

            result.sort((a, b) =>
                a.price - b.price
            );

            break;

        case "priceHigh":

            result.sort((a, b) =>
                b.price - a.price
            );

            break;

        case "ratingHigh":

            result.sort((a, b) =>
                b.rating - a.rating
            );

            break;

        default:

            break;

    }

    filteredGames = result;

    displayGames(filteredGames);

}

// ==========================================
// Event Listeners
// ==========================================

searchInput.addEventListener("input", applyFilters);

categoryFilter.addEventListener("change", applyFilters);

priceFilter.addEventListener("change", applyFilters);

sortFilter.addEventListener("change", applyFilters);

// ==========================================
// Initialize Games
// ==========================================

function initializeGames() {

    filteredGames = [...games];

    // Check if there is a search query in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
        if (searchInput) {
            searchInput.value = searchParam;
        }
        const desktopSearchInput = document.querySelector(".desktop-search input");
        if (desktopSearchInput) {
            desktopSearchInput.value = searchParam;
        }
    }

    applyFilters();

}

// ==========================================
// Load games from games.json
// ==========================================

loadGames();

// Mobile Navbar Menu Toggler
document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.querySelector(".menu-btn");
    const closeBtn = document.querySelector(".close-btn");
    const mobileSidebar = document.querySelector(".mobile-sidebar");
    const overlay = document.querySelector(".sidebar-overlay");
    
    function toggleSidebar(open) {
        if (mobileSidebar) {
            mobileSidebar.classList.toggle("active", open);
        }
        if (overlay) {
            overlay.classList.toggle("active", open);
        }
        document.body.style.overflow = open ? "hidden" : "";
    }
    
    if (menuBtn) {
        menuBtn.addEventListener("click", () => toggleSidebar(true));
    }
    if (closeBtn) {
        closeBtn.addEventListener("click", () => toggleSidebar(false));
    }
    if (overlay) {
        overlay.addEventListener("click", () => toggleSidebar(false));
    }

    // Mirror desktop navbar search input dynamically to main search input
    const desktopSearchInput = document.querySelector(".desktop-search input");
    if (desktopSearchInput) {
        desktopSearchInput.addEventListener("input", (e) => {
            if (searchInput) {
                searchInput.value = e.target.value;
                applyFilters();
            }
        });
        desktopSearchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
            }
        });
    }
});