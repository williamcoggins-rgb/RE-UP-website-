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
        '<span class="snapshot-stat">Avg Cut: <strong id="ticker-avgcut">$33</strong></span>' +
        '<span class="snapshot-divider">|</span>' +
        '<span class="snapshot-stat">Shops: <strong id="ticker-shops">170+</strong></span>' +
        '<span class="snapshot-divider">|</span>' +
        '<span class="snapshot-stat">Barbers: <strong id="ticker-barbers">350+</strong></span>' +
        '<span class="snapshot-divider">|</span>' +
        '<span class="snapshot-stat">Updated: <strong>Mar 2026</strong></span>' +
      '</div>';

    // Listen for Google data to update ticker
    window.addEventListener('reup:google-data', function(event) {
      var stats = event.detail.stats;
      var shops = event.detail.shops || [];
      var total = event.detail.total || 0;

      var tickerShops = document.getElementById('ticker-shops');
      var tickerAvgcut = document.getElementById('ticker-avgcut');
      var tickerBarbers = document.getElementById('ticker-barbers');

      // Total shops = DB count + unique Google shops (deduped)
      var dbCount = (window.RE_UP_MARKET && window.RE_UP_MARKET.COMPETITORS) ? window.RE_UP_MARKET.COMPETITORS.length : 0;
      var dbNames = {};
      if (window.RE_UP_MARKET && window.RE_UP_MARKET.COMPETITORS) {
        window.RE_UP_MARKET.COMPETITORS.forEach(function(c) { dbNames[c.name.toLowerCase().trim()] = true; });
      }
      var uniqueGoogle = 0;
      shops.forEach(function(s) {
        var lower = s.name.toLowerCase().trim();
        var isDupe = dbNames[lower];
        if (!isDupe) {
          Object.keys(dbNames).forEach(function(n) {
            if (!isDupe && (n.indexOf(lower) !== -1 || lower.indexOf(n) !== -1)) isDupe = true;
          });
        }
        if (!isDupe) uniqueGoogle++;
      });
      var totalShops = dbCount + uniqueGoogle;

      if (tickerShops) tickerShops.textContent = totalShops;

      // Blended avg cut
      if (stats && stats.avg_haircut) {
        if (tickerAvgcut) tickerAvgcut.textContent = '$' + stats.avg_haircut;
      }

      // Total barbers
      if (stats && stats.total_barbers) {
        var dbBarbers = 0;
        if (window.RE_UP_MARKET && window.RE_UP_MARKET.COMPETITORS) {
          window.RE_UP_MARKET.COMPETITORS.forEach(function(c) {
            if (typeof c.barbers === 'number') dbBarbers += c.barbers;
          });
        }
        if (tickerBarbers) tickerBarbers.textContent = dbBarbers + stats.total_barbers;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSnapshot);
  } else {
    initSnapshot();
  }
})();
