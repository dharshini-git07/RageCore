

document.addEventListener('DOMContentLoaded', () => {
  initGallery();
  initTabs();
  initRatingRing();
  initSpecToggle();
  initWishlistButton();
  initCartButton();
  initReviewStars();
  initReviewForm();
  initNavbarSearch();
});

/* ---------- Gallery: swap main image on thumbnail click ---------- */
function initGallery() {
  const mainImg = document.getElementById('galleryMainImg');
  const badge = document.querySelector('.gallery-badge');
  const thumbs = document.querySelectorAll('#galleryThumbs .thumb');
  if (!mainImg || !thumbs.length) return;

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
      const fullSrc = thumb.getAttribute('data-full');
      mainImg.src = fullSrc;
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      if (badge) badge.textContent = `Screenshot ${index + 1} / ${thumbs.length}`;
    });
  });
}

/* ---------- Tabs: Description / System Requirements / Reviews ---------- */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');
  if (!tabButtons.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');

      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      panels.forEach(p => p.classList.remove('active'));
      const targetPanel = document.getElementById(`panel-${target}`);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
}

/* ---------- Rating ring: animate stroke based on data-score (out of 5) ---------- */
function initRatingRing() {
  const ring = document.getElementById('ratingRing');
  const ringFill = document.getElementById('ringFill');
  if (!ring || !ringFill) return;

  const score = parseFloat(ring.getAttribute('data-score')) || 0;
  const circumference = 2 * Math.PI * 27; // r=27
  const fillRatio = Math.min(score / 5, 1);
  const offset = circumference - fillRatio * circumference;

  ringFill.style.strokeDasharray = `${circumference}`;
  requestAnimationFrame(() => {
    ringFill.style.strokeDashoffset = `${offset}`;
  });
}

/* ---------- System Requirements: MIN / RECOMMENDED toggle ---------- */
function initSpecToggle() {
  const toggleButtons = document.querySelectorAll('.spec-toggle-btn');
  const minCells = document.querySelectorAll('.spec-min');
  const recCells = document.querySelectorAll('.spec-rec');
  if (!toggleButtons.length) return;

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tier = btn.getAttribute('data-tier');

      toggleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (tier === 'min') {
        minCells.forEach(c => c.classList.remove('hidden'));
        recCells.forEach(c => c.classList.add('hidden'));
      } else {
        minCells.forEach(c => c.classList.add('hidden'));
        recCells.forEach(c => c.classList.remove('hidden'));
      }
    });
  });
}

/* ---------- Wishlist button (visual toggle — storage.js owns persistence) ---------- */
function initWishlistButton() {
  const btn = document.getElementById('wishlistBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const pressed = btn.getAttribute('aria-pressed') === 'true';
    btn.setAttribute('aria-pressed', String(!pressed));
    btn.textContent = pressed ? '♡' : '♥';

    // Hook point: if window.addToWishlist exists (from wishlist.js), call it.
    if (typeof window.addToWishlist === 'function') {
      window.addToWishlist(getCurrentGameId());
    }
  });
}

/* ---------- Add to Cart button ---------- */
function initCartButton() {
  const btn = document.getElementById('addToCartBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const originalText = btn.textContent;
    btn.textContent = 'Added ✓';
    btn.classList.add('added');

    // Hook point: if window.addToCart exists (from cart.js), call it.
    if (typeof window.addToCart === 'function') {
      window.addToCart(getCurrentGameId());
    }

    setTimeout(() => {
      btn.textContent = originalText;
      btn.classList.remove('added');
    }, 1500);
  });
}

/* ---------- Review form: star picker ---------- */
function initReviewStars() {
  const starWrap = document.getElementById('reviewFormStars');
  if (!starWrap) return;
  const stars = starWrap.querySelectorAll('span');

  stars.forEach(star => {
    star.addEventListener('click', () => {
      const value = parseInt(star.getAttribute('data-star'), 10);
      starWrap.setAttribute('data-value', String(value));
      stars.forEach(s => {
        s.classList.toggle('filled', parseInt(s.getAttribute('data-star'), 10) <= value);
      });
    });
  });
}

/* ---------- Review form: submit new review into the list ---------- */
function initReviewForm() {
  const form = document.getElementById('reviewForm');
  const reviewList = document.getElementById('reviewList');
  const starWrap = document.getElementById('reviewFormStars');
  if (!form || !reviewList) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const textarea = form.querySelector('textarea');
    const text = textarea.value.trim();
    const rating = parseInt(starWrap ? starWrap.getAttribute('data-value') : '0', 10) || 5;
    if (!text) return;

    const item = document.createElement('div');
    item.className = 'review-item';
    item.innerHTML = `
      <div class="review-item-head">
        <span class="review-author">You</span>
        <span class="review-stars">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</span>
      </div>
      <p></p>
    `;
    item.querySelector('p').textContent = text; // safe: no HTML injection
    reviewList.prepend(item);

    form.reset();
    if (starWrap) {
      starWrap.setAttribute('data-value', '0');
      starWrap.querySelectorAll('span').forEach(s => s.classList.remove('filled'));
    }
  });
}

/* ---------- Helper: current game id from URL (?id=...) ---------- */
function getCurrentGameId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || 'elden-ring';
}

/* ---------- Navbar Search redirection ---------- */
function initNavbarSearch() {
  const searchInputs = document.querySelectorAll(".desktop-search input, .mobile-search input");
  searchInputs.forEach(input => {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const query = input.value.trim();
        if (query) {
          window.location.href = `games.html?search=${encodeURIComponent(query)}`;
        }
      }
    });
  });
}
