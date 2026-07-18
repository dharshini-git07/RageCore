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


function startUpcomingCountdowns() {
  const blocks = document.querySelectorAll('.upcoming-countdown');
  if (!blocks.length) return;

  function tick() {
    blocks.forEach(block => {
      const target = new Date(block.dataset.target).getTime();
      const now = Date.now();
      const diff = target - now;

      const daysEl  = block.querySelector('.cd-days');
      const hoursEl = block.querySelector('.cd-hours');
      const minsEl  = block.querySelector('.cd-mins');

      if (diff <= 0) {
        daysEl.textContent = '0';
        hoursEl.textContent = '0';
        minsEl.textContent = '0';
        return;
      }

      const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins  = Math.floor((diff / (1000 * 60)) % 60);

      daysEl.textContent = days;
      hoursEl.textContent = hours;
      minsEl.textContent = mins;
    });
  }

  tick();
  setInterval(tick, 60 * 1000); // update every minute
}

document.addEventListener('DOMContentLoaded', startUpcomingCountdowns);

// Notify Me button toggle
document.querySelectorAll('.notify-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const notified = btn.classList.toggle('notified');
    btn.textContent = notified ? 'Notified ✓' : 'Notify Me';
  });
});