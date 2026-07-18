document.addEventListener("DOMContentLoaded", () => {
    const wishlistCards = document.querySelectorAll(".wishlist-card");
    const wishlistGrid = document.getElementById("wishlist-grid-layout");
    const emptyWishlistState = document.getElementById("empty-wishlist");
    const wishlistNavBadge = document.getElementById("wishlist-nav-badge");
    const cartNavBadge = document.getElementById("cart-nav-badge");

    function checkWishlistEmpty() {
        const visibleCards = document.querySelectorAll(".wishlist-card:not(.card-fade-out)");
        
        // Update wishlist nav badge
        if (wishlistNavBadge) {
            wishlistNavBadge.textContent = visibleCards.length;
            if (visibleCards.length === 0) {
                wishlistNavBadge.style.display = "none";
            }
        }

        if (visibleCards.length === 0) {
            if (wishlistGrid) wishlistGrid.classList.add("hidden");
            if (emptyWishlistState) emptyWishlistState.classList.remove("hidden");
        }
    }

    wishlistCards.forEach(card => {
        // Remove item from wishlist
        const removeBtn = card.querySelector(".wishlist-remove-btn");
        if (removeBtn) {
            removeBtn.addEventListener("click", () => {
                card.classList.add("card-fade-out");
                setTimeout(() => {
                    card.remove();
                    checkWishlistEmpty();
                }, 400);
            });
        }

        // Add item to cart from wishlist
        const addToCartBtn = card.querySelector(".btn-add-cart-from-wish");
        if (addToCartBtn) {
            addToCartBtn.addEventListener("click", () => {
                const gameTitle = card.dataset.title;
                alert(`"${gameTitle}" has been added to your Cart!`);

                // Update cart badge dynamically
                if (cartNavBadge) {
                    let currentCount = parseInt(cartNavBadge.textContent || "0", 10);
                    cartNavBadge.textContent = currentCount + 1;
                    cartNavBadge.style.display = "flex";
                }

                // Remove from wishlist visually
                card.classList.add("card-fade-out");
                setTimeout(() => {
                    card.remove();
                    checkWishlistEmpty();
                }, 400);
            });
        }
    });

    // Initial check
    checkWishlistEmpty();
});
