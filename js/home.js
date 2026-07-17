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

new Navbar();

class HeroSlider {

    constructor() {

        this.slides = document.querySelectorAll(".slide");
        this.dots = document.querySelectorAll(".dot");
        this.prevBtn = document.querySelector(".prev-btn");
        this.nextBtn = document.querySelector(".next-btn");

        this.currentIndex = 0;
        this.interval = null;

        if (this.slides.length > 0) {
            this.initialize();
        }

    }

    initialize() {

        this.showSlide(this.currentIndex);

        this.prevBtn?.addEventListener("click", () => this.previousSlide());

        this.nextBtn?.addEventListener("click", () => this.nextSlide());

        this.dots.forEach((dot, index) => {

            dot.addEventListener("click", () => {

                this.showSlide(index);
                this.restartAutoSlide();

            });

        });

        this.startAutoSlide();

    }

    showSlide(index) {

        this.slides.forEach(slide => slide.classList.remove("active"));
        this.dots.forEach(dot => dot.classList.remove("active"));

        this.slides[index].classList.add("active");

        if (this.dots[index]) {
            this.dots[index].classList.add("active");
        }

        this.currentIndex = index;

    }

    nextSlide() {

        const next = (this.currentIndex + 1) % this.slides.length;
        this.showSlide(next);
        this.restartAutoSlide();

    }

    previousSlide() {

        const prev = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prev);
        this.restartAutoSlide();

    }

    startAutoSlide() {

        this.interval = setInterval(() => {

            this.currentIndex = (this.currentIndex + 1) % this.slides.length;
            this.showSlide(this.currentIndex);

        }, 5000);

    }

    restartAutoSlide() {

        clearInterval(this.interval);
        this.startAutoSlide();

    }

}

document.addEventListener("DOMContentLoaded", () => {

    new Navbar();
    new HeroSlider();

});