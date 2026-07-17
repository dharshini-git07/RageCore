/* =========================================================
   GameVault — recommendation.js
   The "You May Also Like" cards are real, hand-written HTML
   in each game's own details page (per team convention:
   content lives in HTML, JS only handles interaction). This
   file picks a random 6 of the existing cards to show and
   hides the rest, excluding whichever card links back to the
   page you're currently on.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  randomizeRecommendations(6);
});

function randomizeRecommendations(count = 6) {
  const track = document.getElementById('recommendationTrack');
  if (!track) return;

  const currentFile = getCurrentFileName();
  const allCards = Array.from(track.querySelectorAll('.rec-card'));

  const pool = allCards.filter(card => !cardMatchesCurrentPage(card, currentFile));
  const picks = pickRandom(pool, count);
  const pickSet = new Set(picks);

  allCards.forEach(card => {
    card.style.display = pickSet.has(card) ? '' : 'none';
  });
}

/* Fisher-Yates shuffle, then slice — avoids bias toward array start */
function pickRandom(arr, count) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

/* Compares a card's href against the file the browser is currently on,
   e.g. cod.html === cod.html — works for the short per-game filenames
   (gta.html, ec.html, cod.html, ...) as well as any ?id=... style links,
   since only the filename portion (before ? or #) is compared. */
function cardMatchesCurrentPage(card, currentFile) {
  const href = card.getAttribute('href') || '';
  const hrefFile = href.split('#')[0].split('?')[0].split('/').pop();
  return hrefFile === currentFile;
}

function getCurrentFileName() {
  const path = window.location.pathname;
  const file = path.substring(path.lastIndexOf('/') + 1);
  return file || 'index.html';
}