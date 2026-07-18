document.addEventListener("DOMContentLoaded", () => {
    const cartItems = document.querySelectorAll(".cart-item");
    const subtotalEl = document.getElementById("summary-subtotal");
    const taxEl = document.getElementById("summary-tax");
    const totalEl = document.getElementById("summary-total");
    const discountRow = document.getElementById("discount-row");
    const discountEl = document.getElementById("summary-discount");
    
    const promoInput = document.getElementById("promo-input");
    const promoApplyBtn = document.getElementById("promo-apply-btn");
    const promoMsg = document.getElementById("promo-message");
    
    const cartContainer = document.getElementById("cart-container-layout");
    const emptyCartState = document.getElementById("empty-cart");
    const cartNavBadge = document.getElementById("cart-nav-badge");

    let discountPercentage = 0;
    const taxRate = 0.08; // 8%

    // Calculate totals
    function updateCartTotals() {
        let subtotal = 0;
        const visibleItems = document.querySelectorAll(".cart-item:not(.slide-out)");
        
        visibleItems.forEach(item => {
            const price = parseFloat(item.dataset.price);
            const qtyInput = item.querySelector(".qty-input");
            const qty = parseInt(qtyInput.value, 10);
            const itemSubtotal = price * qty;
            
            // Update individual item subtotal field
            item.querySelector(".subtotal-val").textContent = `$${itemSubtotal.toFixed(2)}`;
            subtotal += itemSubtotal;
        });

        // Update badge count
        if (cartNavBadge) {
            cartNavBadge.textContent = visibleItems.length;
            if (visibleItems.length === 0) {
                cartNavBadge.style.display = "none";
            }
        }

        // Check if cart is empty
        if (visibleItems.length === 0) {
            if (cartContainer) cartContainer.classList.add("hidden");
            if (emptyCartState) emptyCartState.classList.remove("hidden");
            return;
        }

        // Apply calculations
        let discountAmount = subtotal * (discountPercentage / 100);
        let taxableSubtotal = subtotal - discountAmount;
        let taxAmount = taxableSubtotal * taxRate;
        let finalTotal = taxableSubtotal + taxAmount;

        // Render values
        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        taxEl.textContent = `$${taxAmount.toFixed(2)}`;
        totalEl.textContent = `$${finalTotal.toFixed(2)}`;

        if (discountPercentage > 0) {
            discountRow.style.display = "flex";
            discountEl.textContent = `-$${discountAmount.toFixed(2)}`;
            discountRow.querySelector("span:first-child").textContent = `Discount (${discountPercentage}%)`;
        } else {
            discountRow.style.display = "none";
        }
    }

    // Set up quantity button events
    cartItems.forEach(item => {
        const minusBtn = item.querySelector(".qty-minus");
        const plusBtn = item.querySelector(".qty-plus");
        const qtyInput = item.querySelector(".qty-input");

        minusBtn.addEventListener("click", () => {
            let currentQty = parseInt(qtyInput.value, 10);
            if (currentQty > 1) {
                qtyInput.value = currentQty - 1;
                updateCartTotals();
            }
        });

        plusBtn.addEventListener("click", () => {
            let currentQty = parseInt(qtyInput.value, 10);
            const max = parseInt(qtyInput.getAttribute("max") || "5", 10);
            if (currentQty < max) {
                qtyInput.value = currentQty + 1;
                updateCartTotals();
            }
        });

        // Set up deletion
        const deleteBtn = item.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", () => {
            if (confirm("Remove this game from your cart?")) {
                item.classList.add("slide-out");
                setTimeout(() => {
                    item.remove();
                    updateCartTotals();
                }, 400);
            }
        });

        // Set up move to wishlist
        const wishlistBtn = item.querySelector(".wishlist-btn");
        wishlistBtn.addEventListener("click", () => {
            alert(`"${item.querySelector("h3").textContent}" moved to Wishlist!`);
            item.classList.add("slide-out");
            setTimeout(() => {
                item.remove();
                updateCartTotals();
                
                // Increment wishlist badge count dynamically if element exists
                const wishlistBadge = document.getElementById("wishlist-nav-badge");
                if (wishlistBadge) {
                    let currentCount = parseInt(wishlistBadge.textContent || "0", 10);
                    wishlistBadge.textContent = currentCount + 1;
                }
            }, 400);
        });
    });

    // Apply Coupon
    if (promoApplyBtn) {
        promoApplyBtn.addEventListener("click", () => {
            const code = promoInput.value.trim().toUpperCase();
            
            if (code === "RAGE20") {
                discountPercentage = 20;
                promoMsg.textContent = "Promo code 'RAGE20' applied successfully! (20% Off)";
                promoMsg.className = "promo-msg success";
                updateCartTotals();
            } else if (code === "") {
                promoMsg.textContent = "Please enter a promo code.";
                promoMsg.className = "promo-msg error";
            } else {
                promoMsg.textContent = "Invalid promo code. Try 'RAGE20'";
                promoMsg.className = "promo-msg error";
            }
        });
    }

    // Checkout button alert simulator
    const checkoutBtn = document.querySelector(".btn-checkout");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            alert("Proceeding to Secure Checkout Gateway...");
        });
    }

    // Initialize layout calculations
    updateCartTotals();
});
