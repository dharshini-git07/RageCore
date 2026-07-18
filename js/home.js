class Navbar {

    constructor() {

        this.navbar = document.querySelector(".navbar");
        this.menuBtn = document.querySelector(".menu-btn");
        this.closeBtn = document.querySelector(".close-btn");
        this.sidebar = document.querySelector(".mobile-sidebar");
        this.overlay = document.querySelector(".sidebar-overlay");

        this.initialize();

    }

    initialize() {

        window.addEventListener("scroll", () => this.stickyNavbar());

        this.menuBtn.addEventListener("click", () => this.openSidebar());

        this.closeBtn.addEventListener("click", () => this.closeSidebar());

        this.overlay.addEventListener("click", () => this.closeSidebar());

        document.addEventListener("keydown", (event) => {

            if (event.key === "Escape") {

                this.closeSidebar();

            }

        });

    }

    stickyNavbar() {

        if (window.scrollY > 50) {

            this.navbar.classList.add("scrolled");

        } else {

            this.navbar.classList.remove("scrolled");

        }

    }

    openSidebar() {

        this.sidebar.classList.add("active");

        this.overlay.classList.add("active");

        document.body.style.overflow = "hidden";

    }

    closeSidebar() {

        this.sidebar.classList.remove("active");

        this.overlay.classList.remove("active");

        document.body.style.overflow = "auto";

    }

}


class CountdownTimer {
    constructor() {
        this.daysEl = document.getElementById("timer-days");
        this.hoursEl = document.getElementById("timer-hours");
        this.minutesEl = document.getElementById("timer-minutes");
        this.secondsEl = document.getElementById("timer-seconds");
        this.timerContainer = document.querySelector(".timer-container");

        if (this.daysEl && this.hoursEl && this.minutesEl && this.secondsEl) {
            this.init();
        }
    }

    init() {
        // Retrieve or set target date in localStorage to maintain state across refreshes
        let targetTime = localStorage.getItem("ragecore_offer_target");
        if (!targetTime) {
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + 7);
            targetTime = targetDate.getTime();
            localStorage.setItem("ragecore_offer_target", targetTime);
        }
        
        this.targetTime = parseInt(targetTime, 10);
        this.update();
        this.interval = setInterval(() => this.update(), 1000);
    }

    update() {
        const now = new Date().getTime();
        const difference = this.targetTime - now;

        if (difference <= 0) {
            clearInterval(this.interval);
            if (this.timerContainer) {
                this.timerContainer.innerHTML = '<span class="offer-expired-message">Offer Expired</span>';
            }
            return;
        }

        // Calculation formulas for countdown values
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Render digits with leading zeros
        this.daysEl.textContent = days < 10 ? "0" + days : days;
        this.hoursEl.textContent = hours < 10 ? "0" + hours : hours;
        this.minutesEl.textContent = minutes < 10 ? "0" + minutes : minutes;
        this.secondsEl.textContent = seconds < 10 ? "0" + seconds : seconds;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new Navbar();
    new CountdownTimer();
});

// Callback automatically invoked when games-data.js loads the games
window.initializeGames = function() {
    const featuredContainer = document.getElementById("featuredGames");
    const trendingContainer = document.getElementById("trendingGames");
    
    // Map titles to their exact pages
    const gamePages = {
        "Forza Horizon 5": "forza.html",
        "Grand Theft Auto V": "gta.html",
        "Black Myth: Wukong": "wukong.html",
        "Cyberpunk 2077": "cyber.html",
        "Elden Ring": "game-details.html",
        "EA FC 26": "ec.html",
        "Minecraft": "minecraft.html",
        "Valorant": "valorant.html",
        "PUBG: Battlegrounds": "pubg.html",
        "Assassin's Creed Shadows": "as.html",
        "Red Dead Redemption 2": "rdr2.html",
        "Call of Duty: Black Ops 7": "cod.html"
    };

    function createGameCard(game) {
        const gameCard = document.createElement("a");
        gameCard.href = gamePages[game.title] || "#";
        gameCard.className = "game-card";
        gameCard.style.textDecoration = "none";
        gameCard.style.color = "inherit";
        
        gameCard.innerHTML = `
            <div class="card">
                <div class="card-image">
                    <img src="${game.image}" alt="${game.title}" class="game-image">
                    ${game.discount > 0 ? `<span class="discount-badge">${game.discount}% OFF</span>` : ""}
                    ${game.featured ? `<span class="featured-badge">⭐ Featured</span>` : ""}
                    ${game.trending ? `<span class="trending-badge">🔥 Trending</span>` : ""}
                </div>
                <div class="game-info">
                    <span class="badge">${game.category}</span>
                    <h3>${game.title}</h3>
                    <p class="rating">⭐ ${game.rating}</p>
                    ${game.price === 0 ? `
                        <h4 class="free-price">Free</h4>
                    ` : `
                        <div class="price-box">
                            ${game.originalPrice > game.price ? `<span class="original-price">₹${game.originalPrice.toLocaleString()}</span>` : ""}
                            <h4 class="current-price">₹${game.price.toLocaleString()}</h4>
                        </div>
                    `}
                    <button class="btn btn-primary">View Details</button>
                </div>
            </div>
        `;
        return gameCard;
    }

    // Process Featured Games (Max 4)
    if (featuredContainer && typeof games !== "undefined") {
        featuredContainer.innerHTML = "";
        const featuredList = games.filter(game => game.featured).slice(0, 4);
        featuredList.forEach(game => {
            featuredContainer.appendChild(createGameCard(game));
        });
    }

    // Process Trending Games (Max 4)
    if (trendingContainer && typeof games !== "undefined") {
        trendingContainer.innerHTML = "";
        const trendingList = games.filter(game => game.trending).slice(0, 4);
        trendingList.forEach(game => {
            trendingContainer.appendChild(createGameCard(game));
        });
    }
};

// Safety check: if games are already loaded in global scope, initialize immediately
if (typeof games !== "undefined" && games.length > 0) {
    window.initializeGames();
}