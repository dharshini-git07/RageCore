/* ============================================================
   Add these small snippets into details.js (merge with existing code,
   don't just append blindly — hook into your existing gallery/tab logic)
   ============================================================ */

// 1) Rating ring — set the dash offset based on score (out of 5)
(function setRingOffset() {
  const ring = document.getElementById('ratingRing');
  const fill = document.getElementById('ringFill');
  if (!ring || !fill) return;
  const score = parseFloat(ring.dataset.score || '0');
  const circumference = 170; // matches stroke-dasharray in CSS
  const offset = circumference - (score / 5) * circumference;
  fill.style.setProperty('--ring-offset', offset);
})();

// 2) Rec-card stagger index (for the animation-delay var)
document.querySelectorAll('.rec-card').forEach((card, i) => {
  card.style.setProperty('--i', i);
});

// 3) Gallery image swap animation — call this instead of directly
//    setting src when a thumbnail is clicked
function swapGalleryImage(newSrc) {
  const mainImg = document.getElementById('galleryMainImg');
  if (!mainImg) return;
  mainImg.classList.remove('swap');
  void mainImg.offsetWidth; // restart animation
  mainImg.src = newSrc;
  mainImg.classList.add('swap');
}
// In your existing thumb click handler, replace the line that sets
// mainImg.src = thumb.dataset.full  with:  swapGalleryImage(thumb.dataset.full);

// 4) Toast helper — call showToast("Added to cart") from your
//    Add to Cart / Wishlist click handlers
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.remove('show-toast');
  void toast.offsetWidth;
  toast.classList.add('show-toast');
}
// Example hook into existing buttons:
// document.getElementById('addToCartBtn').addEventListener('click', () => showToast('Added to cart!'));
// document.getElementById('wishlistBtn').addEventListener('click', () => {
//   wishlistBtn.classList.toggle('active');
//   showToast(wishlistBtn.classList.contains('active') ? 'Added to wishlist' : 'Removed from wishlist');
// });

// 5) Review bars — trigger the width transition after paint
window.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => {
    document.querySelectorAll('.bar-row .bar > div').forEach(bar => {
      const w = bar.style.width;
      bar.style.width = '0%';
      requestAnimationFrame(() => { bar.style.width = w; });
    });
  });
});

// 6) Review form star rating — click to fill
const starWrap = document.getElementById('reviewFormStars');
if (starWrap) {
  const stars = starWrap.querySelectorAll('span');
  starWrap.addEventListener('click', (e) => {
    const val = e.target.dataset.star;
    if (!val) return;
    starWrap.dataset.value = val;
    stars.forEach(s => s.classList.toggle('filled', s.dataset.star <= val));
  });
}

// 7) Generic scroll-reveal (optional — tag any element with class="reveal")
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));