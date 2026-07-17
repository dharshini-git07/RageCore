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

document.addEventListener("DOMContentLoaded", () => {
    new Navbar();
});