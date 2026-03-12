/* ============================================================
   RE UP Report — Bottom Ticker
   Scrolling live market pricing data from verified sources
   ============================================================ */

(function () {
  // All prices verified from Booksy, Squire, Fresha, shop websites, Yelp
  // Each entry maps to a real record in data/exports/pricing.json
  var TICKER_DATA = [
    { shop: "Modern Classics", service: "Men's Cut", price: "$65", zip: "28203" },
    { shop: "NoDa Barbers", service: "Faded Cut", price: "$45", zip: "28205" },
    { shop: "Hawk & Fade", service: "Men's Cut", price: "$40", zip: "28203" },
    { shop: "Uptown Cuts", service: "Men's Cut", price: "$40", zip: "28202" },
    { shop: "Charlotte Barber & Beard", service: "Men's Cut", price: "$45", zip: "28205" },
    { shop: "Midwood Barbers", service: "Men's Cut", price: "$35", zip: "28205" },
    { shop: "Headz Up", service: "Men's Cut", price: "$35", zip: "28273" },
    { shop: "The CUT", service: "Men's Cut", price: "$30", zip: "28202" },
    { shop: "Urban Barber", service: "Men's Cut", price: "$30", zip: "28209" },
    { shop: "No Grease Mosaic", service: "Cut + Shave", price: "$30", zip: "28216" },
    { shop: "Arrow South End", service: "Men's Cut", price: "$27", zip: "28203" },
    { shop: "Arrow Park Rd", service: "Men's Cut", price: "$27", zip: "28209" },
    { shop: "Tha Kut Club", service: "Men's Cut", price: "$25", zip: "28216" },
    { shop: "Right Touch", service: "Walk-in Cut", price: "$25", zip: "28215" },
    { shop: "Selwyn Barber", service: "Men's Cut", price: "$23", zip: "28209" },
    { shop: "Harris Barber", service: "Men's Cut", price: "$20", zip: "28206" },
    { shop: "Hawk & Fade", service: "Beard Trim", price: "$25", zip: "28203" },
    { shop: "Hawk & Fade", service: "Lineup", price: "$20", zip: "28203" },
    { shop: "Hawk & Fade", service: "Hot Towel", price: "$40", zip: "28203" },
    { shop: "Midwood Barbers", service: "Fade", price: "$60", zip: "28205" },
    { shop: "Modern Classics", service: "Fade", price: "$65", zip: "28203" },
    { shop: "Right Touch", service: "Fade", price: "$50", zip: "28215" },
    { shop: "Tha Kut Club", service: "Kids Cut", price: "$20", zip: "28216" },
    { shop: "NoDa Barbers", service: "Kids Cut", price: "$35", zip: "28205" },
    { shop: "City Barbers", service: "Kids Cut", price: "$26", zip: "28202" },
    { shop: "No Grease Mosaic", service: "Standard", price: "$40", zip: "28216" },
    { shop: "Selwyn Barber", service: "Beard Add-on", price: "$5", zip: "28209" },
    { shop: "Arrow Plaza Midwood", service: "Beard Trim", price: "$15", zip: "28205" },
    { shop: "Fade Factory", service: "Men's Cut", price: "$50", zip: "28213" },
    { shop: "DJ The Fademaster", service: "Men's Cut", price: "$35", zip: "28213" },
    { shop: "The Cutting Room", service: "Men's Cut", price: "$40", zip: "28213" },
    { shop: "Clean Cuts", service: "Men's Cut", price: "$30", zip: "28213" },
    { shop: "34th Design", service: "Men's Cut", price: "$35", zip: "28213" },
    { shop: "Overton's Barber", service: "Men's Cut", price: "$35", zip: "28213" },
    { shop: "Just For You II", service: "Men's Cut", price: "$25", zip: "28213" },
    { shop: "Fade Factory", service: "Fade", price: "$50", zip: "28213" },
    { shop: "DJ The Fademaster", service: "Fade", price: "$35", zip: "28213" },
    { shop: "The Cutting Room", service: "Fade", price: "$40", zip: "28213" },
    { shop: "Fade Factory", service: "Beard Trim", price: "$35", zip: "28213" },
    { shop: "DJ The Fademaster", service: "Beard Trim", price: "$20", zip: "28213" },
    { shop: "The Cutting Room", service: "Beard Trim", price: "$25", zip: "28213" }
  ];

  function buildTickerHTML() {
    var html = "";
    for (var i = 0; i < TICKER_DATA.length; i++) {
      var d = TICKER_DATA[i];
      html +=
        '<span class="ticker-item-live">' +
          '<span class="ticker-shop-name">' + d.shop + '</span>' +
          '<span class="ticker-service-name">' + d.service + '</span>' +
          '<span class="ticker-price-live">' + d.price + '</span>' +
          '<span class="ticker-zip">' + d.zip + '</span>' +
        '</span>';
    }
    return html;
  }

  function initTicker() {
    var container = document.getElementById("ticker-scroll");
    if (!container) return;

    // Build items twice for seamless infinite scroll
    var itemsHTML = buildTickerHTML();
    container.innerHTML = itemsHTML + itemsHTML;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTicker);
  } else {
    initTicker();
  }
})();
