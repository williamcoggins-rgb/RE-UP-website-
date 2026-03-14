/* ============================================================
   RE UP Report — Bottom Market Snapshot
   Static weekly market summary replacing the scrolling ticker
   ============================================================ */

(function () {
  'use strict';

  function initSnapshot() {
    var ticker = document.querySelector('.bottom-ticker');
    if (!ticker) return;

    // Replace the entire ticker contents with a static snapshot bar
    ticker.innerHTML =
      '<div class="snapshot-label">CLT MARKET SNAPSHOT</div>' +
      '<div class="snapshot-stats">' +
        '<span class="snapshot-stat">Avg Cut: <strong>$37</strong></span>' +
        '<span class="snapshot-divider">|</span>' +
        '<span class="snapshot-stat">Shops: <strong>47</strong></span>' +
        '<span class="snapshot-divider">|</span>' +
        '<span class="snapshot-stat">Barbers: <strong>85</strong></span>' +
        '<span class="snapshot-divider">|</span>' +
        '<span class="snapshot-stat">Updated: <strong>Mar 2026</strong></span>' +
      '</div>';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSnapshot);
  } else {
    initSnapshot();
  }
})();
