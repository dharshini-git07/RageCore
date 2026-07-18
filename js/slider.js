class HeroSlider {
    constructor() {
        
        this.slides = document.querySelectorAll(".slide");
        this.dots = document.querySelectorAll(".dot");
        this.prevBtn = document.querySelector(".slider-btn.prev");
        this.nextBtn = document.querySelector(".slider-btn.next");
        this.heroSection = document.querySelector(".hero");

        this.currentIndex = 0;
        this.interval = null;
        this.isTransitioning = false;
        this.isHovered = false;
        this.transitionDuration = 1200; 
        this.autoPlayTime = 5000; 

        if (this.slides.length > 0) {
            this.init();
        }
    }


    init() {
        this.slides.forEach((slide, index) => {
            slide.classList.remove("active", "exit-left", "exit-right", "enter-left");
            if (index === this.currentIndex) {
                slide.classList.add("active");
            }
        });

        this.prevBtn?.addEventListener("click", () => this.previousSlide());
        this.nextBtn?.addEventListener("click", () => this.nextSlide());

        this.dots.forEach((dot, index) => {
            dot.addEventListener("click", () => this.goToSlide(index));
        });

        this.heroSection?.addEventListener("mouseenter", () => {
            this.isHovered = true;
            this.pauseAutoSlide();
        });

        this.heroSection?.addEventListener("mouseleave", () => {
            this.isHovered = false;
            this.startAutoSlide();
        });

        this.startAutoSlide();
    }

    startAutoSlide() {
        this.pauseAutoSlide();
        this.interval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayTime);
    }

    pauseAutoSlide() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    nextSlide() {
        if (this.isTransitioning) return;
        const nextIndex = (this.currentIndex + 1) % this.slides.length;
        this.changeSlide(nextIndex, "next");
    }

    previousSlide() {
        if (this.isTransitioning) return;
        const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.changeSlide(prevIndex, "prev");
    }

    /**
     * Go to a specific slide based on index.
     * @param {number} index - Index of slide to display
     */
    goToSlide(index) {
        if (this.isTransitioning || index === this.currentIndex) return;
        const direction = index > this.currentIndex ? "next" : "prev";
        this.changeSlide(index, direction);
    }

    /**
     * Handle the slide transition logic and classes.
     * @param {number} nextIndex - The target slide index
     * @param {string} direction - Transition direction: 'next' or 'prev'
     */
    changeSlide(nextIndex, direction) {
        this.isTransitioning = true;
        this.pauseAutoSlide();

        const currentSlide = this.slides[this.currentIndex];
        const nextSlide = this.slides[nextIndex];

        this.dots.forEach((dot, index) => {
            if (index === nextIndex) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });

        if (direction === "next") {
            nextSlide.classList.remove("exit-left", "exit-right", "enter-left");
            
            nextSlide.offsetHeight;

            nextSlide.classList.add("active");
            currentSlide.classList.add("exit-left");
            currentSlide.classList.remove("active");
        } else {
            nextSlide.classList.remove("exit-left", "exit-right");
            
            nextSlide.classList.add("enter-left");
            
            nextSlide.offsetHeight;

            nextSlide.classList.remove("enter-left");
            nextSlide.classList.add("active");
            currentSlide.classList.add("exit-right");
            currentSlide.classList.remove("active");
        }

        this.currentIndex = nextIndex;

        setTimeout(() => {
            currentSlide.classList.remove("exit-left", "exit-right");
            this.isTransitioning = false;
            
            if (!this.isHovered) {
                this.startAutoSlide();
            }
        }, this.transitionDuration);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new HeroSlider();
});
