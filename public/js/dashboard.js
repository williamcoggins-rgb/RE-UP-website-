/* ============================================================
   RE UP Report — Charlotte Market Dashboard
   js/dashboard.js
   ============================================================ */

// --------------- HELPERS ---------------

/** Remove skeleton placeholders by data-skeleton key (or all if no key given) */
function removeSkeleton(key) {
  var selector = key ? '[data-skeleton="' + key + '"]' : '[data-skeleton]';
  var els = document.querySelectorAll(selector);
  for (var i = 0; i < els.length; i++) els[i].remove();
}

// --------------- SEED DATA ---------------
// Data now loaded from js/market-data.js → window.RE_UP_MARKET
// Local aliases for backward compatibility within this file.
const PRICING_BY_ZIP = (window.RE_UP_MARKET && window.RE_UP_MARKET.PRICING_BY_ZIP) || [
  { zip: "28202", area: "Uptown / Center City", haircut: 35, beard: "—", students: 26, hotTowel: "—", lineup: "—", shops: 5 },
  { zip: "28203", area: "South End / Dilworth", haircut: 44, beard: 25, students: "—", hotTowel: 40, lineup: 20, shops: 6 },
  { zip: "28205", area: "NoDa / Plaza Midwood", haircut: 38, beard: 23, students: 31, hotTowel: "—", lineup: "—", shops: 5 },
  { zip: "28206", area: "North Charlotte / Druid Hills", haircut: 20, beard: "—", students: "—", hotTowel: "—", lineup: "—", shops: 2 },
  { zip: "28208", area: "West Charlotte / Airport", haircut: "—", beard: "—", students: "—", hotTowel: "—", lineup: "—", shops: 3 },
  { zip: "28209", area: "Park Road / Selwyn", haircut: 27, beard: 12, students: "—", hotTowel: "—", lineup: "—", shops: 4 },
  { zip: "28210", area: "South Charlotte / Sharon Lakes", haircut: "—", beard: "—", students: "—", hotTowel: "—", lineup: "—", shops: 1 },
  { zip: "28211", area: "SouthPark / Myers Park", haircut: "—", beard: "—", students: "—", hotTowel: "—", lineup: "—", shops: 2 },
  { zip: "28213", area: "University City / UNCC", haircut: 35, beard: 25, students: "—", hotTowel: "—", lineup: "—", shops: 8 },
  { zip: "28215", area: "East Charlotte / Albemarle Rd", haircut: 25, beard: "—", students: "—", hotTowel: "—", lineup: "—", shops: 2 },
  { zip: "28216", area: "Brookshire / North Charlotte", haircut: 33, beard: "—", students: 20, hotTowel: "—", lineup: "—", shops: 3 },
  { zip: "28262", area: "University City / N Tryon", haircut: "—", beard: "—", students: "—", hotTowel: "—", lineup: "—", shops: 2 },
  { zip: "28269", area: "University City / WT Harris", haircut: "—", beard: "—", students: "—", hotTowel: "—", lineup: "—", shops: 2 },
  { zip: "28273", area: "Steele Creek", haircut: 35, beard: "—", students: "—", hotTowel: "—", lineup: "—", shops: 2 }
];

// Shops data from js/market-data.js → window.RE_UP_MARKET
const COMPETITORS = (window.RE_UP_MARKET && window.RE_UP_MARKET.COMPETITORS) || [
  // 28202 — Uptown / Center City
  { name: "The CUT Barbershop", neighborhood: "Uptown", zip: "28202", avgCut: 30, rating: 4.7, barbers: 3, model: "Hybrid", tier: "Mid-tier" },
  { name: "Uptown Cuts", neighborhood: "Uptown", zip: "28202", avgCut: 40, rating: 5.0, barbers: 4, model: "Appointment", tier: "Premium" },
  { name: "Knights of the Razor by No Grease", neighborhood: "Uptown", zip: "28202", avgCut: "—", rating: 4.3, barbers: "—", model: "Appointment", tier: "Mid-tier" },
  { name: "City Barbers at Uptown", neighborhood: "Uptown", zip: "28202", avgCut: "—", rating: 4.6, barbers: 3, model: "Hybrid", tier: "Mid-tier" },
  { name: "Scissors & Scotch", neighborhood: "Uptown", zip: "28202", avgCut: "—", rating: 4.9, barbers: "—", model: "Appointment", tier: "Premium" },
  // 28203 — South End / Dilworth
  { name: "Modern Classics South End", neighborhood: "South End", zip: "28203", avgCut: 65, rating: 4.9, barbers: 5, model: "Appointment", tier: "Premium" },
  { name: "Hawk & Fade Barbershop", neighborhood: "South End", zip: "28203", avgCut: 40, rating: 4.8, barbers: 3, model: "Hybrid", tier: "Premium" },
  { name: "Caliber Men's Grooming", neighborhood: "South End", zip: "28203", avgCut: "—", rating: 4.7, barbers: 5, model: "Hybrid", tier: "Mid-tier" },
  { name: "Arrow - South End", neighborhood: "South End", zip: "28203", avgCut: 27, rating: 4.8, barbers: "—", model: "Hybrid", tier: "Mid-tier" },
  { name: "Southside Barber Shop", neighborhood: "South End", zip: "28203", avgCut: "—", rating: 4.0, barbers: 4, model: "Walk-in", tier: "Value" },
  { name: "Shear Excellence - Dilworth", neighborhood: "Dilworth", zip: "28203", avgCut: "—", rating: 4.7, barbers: "—", model: "Appointment", tier: "Mid-tier" },
  // 28205 — NoDa / Plaza Midwood
  { name: "Midwood Barbers", neighborhood: "Plaza Midwood", zip: "28205", avgCut: 35, rating: 4.9, barbers: 6, model: "Appointment", tier: "Mid-tier" },
  { name: "NoDa Barbers", neighborhood: "NoDa", zip: "28205", avgCut: 45, rating: 4.7, barbers: 3, model: "Appointment", tier: "Premium" },
  { name: "Charlotte Barber & Beard", neighborhood: "Plaza Midwood", zip: "28205", avgCut: 45, rating: 4.6, barbers: 5, model: "Appointment", tier: "Premium" },
  { name: "Arrow - Plaza Midwood", neighborhood: "Plaza Midwood", zip: "28205", avgCut: 27, rating: 4.8, barbers: "—", model: "Hybrid", tier: "Mid-tier" },
  { name: "Next Level Hair Studio", neighborhood: "Plaza Midwood", zip: "28205", avgCut: "—", rating: "—", barbers: "—", model: "Appointment", tier: "Mid-tier" },
  // 28206 — North Charlotte / Druid Hills
  { name: "Harris Barber Shop", neighborhood: "Druid Hills", zip: "28206", avgCut: 20, rating: 4.7, barbers: 4, model: "Walk-in", tier: "Value" },
  { name: "Gillespie Barber & Stylist", neighborhood: "North Charlotte", zip: "28206", avgCut: "—", rating: 4.0, barbers: 6, model: "Hybrid", tier: "Value" },
  // 28208 — West Charlotte / Airport
  { name: "The Man Cave Barbershop Charlotte LLC", neighborhood: "West Charlotte", zip: "28208", avgCut: "—", rating: 4.6, barbers: "—", model: "Hybrid", tier: "Mid-tier" },
  { name: "Da Lucky Spot", neighborhood: "West Charlotte", zip: "28208", avgCut: "—", rating: 5.0, barbers: "—", model: "Hybrid", tier: "Mid-tier" },
  { name: "Victory Cutz Barber Lounge CLT", neighborhood: "West Charlotte", zip: "28208", avgCut: "—", rating: "—", barbers: "—", model: "Appointment", tier: "Mid-tier" },
  // 28209 — Park Road / Selwyn
  { name: "Modern Haircutters (Park Road Barbers)", neighborhood: "Park Road", zip: "28209", avgCut: "—", rating: 4.5, barbers: 3, model: "Appointment", tier: "Mid-tier" },
  { name: "Selwyn Barber & Style", neighborhood: "Myers Park", zip: "28209", avgCut: 23, rating: 4.8, barbers: 6, model: "Hybrid", tier: "Value" },
  { name: "Arrow - Park Road", neighborhood: "Park Road", zip: "28209", avgCut: 27, rating: 4.8, barbers: "—", model: "Hybrid", tier: "Mid-tier" },
  { name: "Urban Barber & Style", neighborhood: "South Blvd", zip: "28209", avgCut: 30, rating: 5.0, barbers: 2, model: "Hybrid", tier: "Mid-tier" },
  // 28210 — South Charlotte / Sharon Lakes
  { name: "Bladez Barber Shop", neighborhood: "Sharon Lakes", zip: "28210", avgCut: "—", rating: 4.3, barbers: 5, model: "Hybrid", tier: "Mid-tier" },
  // 28211 — SouthPark / Myers Park
  { name: "South Park Barber Shop", neighborhood: "SouthPark", zip: "28211", avgCut: "—", rating: 4.6, barbers: 2, model: "Hybrid", tier: "Mid-tier" },
  { name: "Freshen Up Barbershop", neighborhood: "SouthPark", zip: "28211", avgCut: "—", rating: 4.9, barbers: 1, model: "Appointment", tier: "Premium" },
  // 28213 — University City / UNCC
  { name: "Kutt Masters Barbershop", neighborhood: "University City", zip: "28213", avgCut: "—", rating: 4.6, barbers: "—", model: "Hybrid", tier: "Mid-tier" },
  { name: "Fade Factory Barbershop", neighborhood: "University City", zip: "28213", avgCut: 50, rating: 4.5, barbers: "—", model: "Appointment", tier: "Premium" },
  { name: "DJ The Fademaster", neighborhood: "University City", zip: "28213", avgCut: 35, rating: 5.0, barbers: 1, model: "Booth Rental", tier: "Mid-tier" },
  { name: "The Cutting Room Grooming Lounge", neighborhood: "University City", zip: "28213", avgCut: 40, rating: 5.0, barbers: "—", model: "Booth Rental", tier: "Mid-tier" },
  { name: "Just For You Barber & Beauty II", neighborhood: "University City", zip: "28213", avgCut: 25, rating: 4.3, barbers: "—", model: "Hybrid", tier: "Value" },
  { name: "34th Design Barbershop", neighborhood: "University City", zip: "28213", avgCut: 35, rating: 4.6, barbers: "—", model: "Booth Rental", tier: "Mid-tier" },
  { name: "Clean Cuts Barbershop", neighborhood: "University City", zip: "28213", avgCut: 30, rating: 5.0, barbers: "—", model: "Walk-in", tier: "Mid-tier" },
  { name: "Overton's Barber & Styling", neighborhood: "University City", zip: "28213", avgCut: 35, rating: 4.8, barbers: "—", model: "Walk-in", tier: "Mid-tier" },
  // 28215 — East Charlotte / Albemarle Rd
  { name: "Edward's Boyz Barber Shop", neighborhood: "East Charlotte", zip: "28215", avgCut: "—", rating: 4.8, barbers: "—", model: "Hybrid", tier: "Mid-tier" },
  { name: "Right Touch Barbershop", neighborhood: "East Charlotte", zip: "28215", avgCut: 25, rating: 5.0, barbers: "—", model: "Hybrid", tier: "Mid-tier" },
  // 28216 — Brookshire / North Charlotte
  { name: "M&M Barber Studio", neighborhood: "Brookshire", zip: "28216", avgCut: "—", rating: "—", barbers: "—", model: "Appointment", tier: "Mid-tier" },
  { name: "Tha Kut Club Barbershop Lounge", neighborhood: "Brookshire", zip: "28216", avgCut: 25, rating: 5.0, barbers: "—", model: "Appointment", tier: "Value" },
  { name: "No Grease Mosaic", neighborhood: "Brookshire", zip: "28216", avgCut: 30, rating: 4.2, barbers: "—", model: "Hybrid", tier: "Mid-tier" },
  // 28262 — University City / N Tryon
  { name: "Emperial Barber Lounge", neighborhood: "University City", zip: "28262", avgCut: "—", rating: 4.9, barbers: "—", model: "Appointment", tier: "Mid-tier" },
  { name: "Azeal Barbershop", neighborhood: "University City", zip: "28262", avgCut: "—", rating: "—", barbers: "—", model: "Appointment", tier: "Mid-tier" },
  // 28269 — University City / WT Harris
  { name: "Just For You", neighborhood: "University City", zip: "28269", avgCut: "—", rating: 4.6, barbers: "—", model: "Hybrid", tier: "Mid-tier" },
  { name: "MVP's Grooming Lounge", neighborhood: "University City", zip: "28269", avgCut: "—", rating: 5.0, barbers: "—", model: "Appointment", tier: "Mid-tier" },
  // 28273 — Steele Creek
  { name: "Verified Cuts", neighborhood: "Steele Creek", zip: "28273", avgCut: "—", rating: 5.0, barbers: "—", model: "Appointment", tier: "Mid-tier" },
  { name: "Headz Up Barbershop", neighborhood: "Steele Creek", zip: "28273", avgCut: 35, rating: "—", barbers: "—", model: "Appointment", tier: "Mid-tier" }
];

// All social data verified via Instagram profile pages. No engagement rates — not publicly available.
const SOCIAL_LEADERS = [
  { rank: 1,  name: "No Grease Barbershop",      type: "Shop", platform: "Instagram", followers: 24000,  engagement: "—" },
  { rank: 2,  name: "Midwood Barbers",            type: "Shop", platform: "Instagram", followers: 7316,   engagement: "—" },
  { rank: 3,  name: "Edward's Boyz Barber Shop",  type: "Shop", platform: "Instagram", followers: 6411,   engagement: "—" },
  { rank: 4,  name: "Arrow Barbering Co.",         type: "Shop", platform: "Instagram", followers: 4620,   engagement: "—" },
  { rank: 5,  name: "Da Lucky Spot",              type: "Shop", platform: "Instagram", followers: 3523,   engagement: "—" },
  { rank: 6,  name: "The CUT Barbershop",         type: "Shop", platform: "Instagram", followers: 2768,   engagement: "—" },
  { rank: 7,  name: "Charlotte Barber & Beard",   type: "Shop", platform: "Instagram", followers: 2007,   engagement: "—" },
  { rank: 8,  name: "Caliber Men's Grooming",     type: "Shop", platform: "Instagram", followers: 1642,   engagement: "—" },
  { rank: 9,  name: "Modern Classics South End",  type: "Shop", platform: "Instagram", followers: 1313,   engagement: "—" },
  { rank: 10, name: "NoDa Barbers",               type: "Shop", platform: "Instagram", followers: 1067,   engagement: "—" },
  { rank: 11, name: "Kutt Masters Barbershop",    type: "Shop", platform: "Instagram", followers: 976,    engagement: "—" },
  { rank: 12, name: "Next Level Hair Studio",     type: "Shop", platform: "Instagram", followers: 940,    engagement: "—" },
  { rank: 13, name: "Hawk & Fade Barbershop",     type: "Shop", platform: "Instagram", followers: 935,    engagement: "—" },
  { rank: 14, name: "Right Touch Barbershop",     type: "Shop", platform: "Instagram", followers: 545,    engagement: "—" },
  { rank: 15, name: "Scissors & Scotch CLT",      type: "Shop", platform: "Instagram", followers: 507,    engagement: "—" },
  { rank: 16, name: "Uptown Cuts",                type: "Shop", platform: "Instagram", followers: 304,    engagement: "—" },
  { rank: 17, name: "City Barbers at Uptown",     type: "Shop", platform: "Instagram", followers: 295,    engagement: "—" },
  { rank: 18, name: "South Park Barber Shop",     type: "Shop", platform: "Instagram", followers: 146,    engagement: "—" },
  { rank: 19, name: "Colonial Barber Shop",       type: "Shop", platform: "Instagram", followers: 87,     engagement: "—" }
];

// No market moves included — only verified events will be added as they are confirmed.
const MARKET_MOVES = [];

const DENSITY = PRICING_BY_ZIP.map(function (row) {
  return { zip: row.zip, area: row.area, count: row.shops };
});

// --------------- ADMIN LOGIN ---------------

function setupAdminLogin(isLoggedIn) {
  var loginLink = document.getElementById('adminLoginLink');
  var logoutLink = document.getElementById('adminLogoutLink');

  if (isLoggedIn) {
    if (loginLink) loginLink.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'inline';
  }

  if (logoutLink) {
    logoutLink.addEventListener('click', function (e) {
      e.preventDefault();
      window.RE_UP_AUTH.logout().then(function () {
        location.reload();
      });
    });
  }
}

function buildDashPaywall() {
  return '<div class="dash-paywall">' +
    '<div class="dash-paywall-header">' +
      '<h2 class="paywall-title">Unlock the full Charlotte market dashboard</h2>' +
      '<p class="paywall-subtitle">You\u2019re seeing the snapshot. RE UP Intel gives you the complete picture \u2014 every shop, every price, every neighborhood.</p>' +
    '</div>' +

    '<div class="dash-paywall-grid">' +
      '<div class="dash-paywall-card">' +
        '<h3 class="dash-paywall-card-title">Pricing by Zip Code</h3>' +
        '<p class="dash-paywall-card-desc">See exactly what shops charge for every service across 14 Charlotte zip codes. Compare your rates against real market data \u2014 not guesses.</p>' +
        '<span class="dash-paywall-card-tag">14 zips tracked</span>' +
      '</div>' +
      '<div class="dash-paywall-card">' +
        '<h3 class="dash-paywall-card-title">Competitor Directory</h3>' +
        '<p class="dash-paywall-card-desc">170+ shops profiled with pricing, ratings, barber count, and business model. Search by name, neighborhood, or zip to find your direct competition.</p>' +
        '<span class="dash-paywall-card-tag">170+ shops</span>' +
      '</div>' +
      '<div class="dash-paywall-card">' +
        '<h3 class="dash-paywall-card-title">Social Leaderboard</h3>' +
        '<p class="dash-paywall-card-desc">See which Charlotte shops and barbers are winning on Instagram. Ranked by follower count so you know who\u2019s dominating the local conversation.</p>' +
        '<span class="dash-paywall-card-tag">19 accounts ranked</span>' +
      '</div>' +
      '<div class="dash-paywall-card">' +
        '<h3 class="dash-paywall-card-title">Shop Density Map</h3>' +
        '<p class="dash-paywall-card-desc">See where the competition is concentrated \u2014 and where the gaps are. Find underserved zip codes where a new chair or second location could thrive.</p>' +
        '<span class="dash-paywall-card-tag">14 zones mapped</span>' +
      '</div>' +
    '</div>' +

    '<div class="dash-paywall-cta-section">' +
      '<p class="dash-paywall-use-case">How barbers use this data:</p>' +
      '<ul class="dash-paywall-use-list">' +
        '<li><strong>Price confidently</strong> \u2014 Know what your neighborhood charges before you set your rates</li>' +
        '<li><strong>Find your edge</strong> \u2014 Spot gaps in service coverage and underserved zip codes</li>' +
        '<li><strong>Track competitors</strong> \u2014 See who\u2019s expanding, who\u2019s raising prices, and who\u2019s growing online</li>' +
        '<li><strong>Plan your next move</strong> \u2014 Whether it\u2019s a second chair, a new location, or a price adjustment \u2014 use real data, not instinct</li>' +
      '</ul>' +
    '</div>' +

    '<div class="paywall-plans">' +
      '<div class="paywall-plan">' +
        '<div class="paywall-plan-name">Intel Monthly <span class="reup-coming-soon">Coming Soon</span></div>' +
        '<div class="paywall-plan-price"><span class="paywall-currency">$</span>9<span class="paywall-period">/mo</span></div>' +
        '<ul class="paywall-plan-includes">' +
          '<li>Full market dashboard</li>' +
          '<li>All articles &amp; outlook briefs</li>' +
          '<li>Weekly email intel digest</li>' +
        '</ul>' +
        '<button class="btn btn-primary paywall-cta" data-plan="monthly">Join the Waitlist</button>' +
      '</div>' +
      '<div class="paywall-plan paywall-plan--featured">' +
        '<div class="paywall-plan-badge">Best Value</div>' +
        '<div class="paywall-plan-name">Intel Annual <span class="reup-coming-soon">Coming Soon</span></div>' +
        '<div class="paywall-plan-price"><span class="paywall-currency">$</span>79<span class="paywall-period">/yr</span></div>' +
        '<div class="paywall-plan-savings">Save $29 vs monthly</div>' +
        '<ul class="paywall-plan-includes">' +
          '<li>Everything in Monthly</li>' +
          '<li>Quarterly market reports</li>' +
          '<li>Priority access to new tools</li>' +
        '</ul>' +
        '<button class="btn btn-primary paywall-cta" data-plan="annual">Join the Waitlist</button>' +
      '</div>' +
    '</div>' +

    '<p class="paywall-note">Subscriptions launching soon. Built by barbers, for barbers.</p>' +
  '</div>';
}

// --------------- UTILITY HELPERS ---------------

function formatPrice(n) {
  if (n === "—" || n === undefined || n === null) return "—";
  return "$" + n;
}

function formatFollowers(n) {
  return n.toLocaleString("en-US");
}

// --------------- RENDER: PRICING TABLE ---------------

function renderPricingTable() {
  var tbody = document.getElementById("pricing-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  PRICING_BY_ZIP.forEach(function (row) {
    var tr = document.createElement("tr");
    tr.innerHTML =
      '<td class="cell-mono" data-label="Zip">' + escapeHtml(row.zip) + "</td>" +
      '<td data-label="Area">' + escapeHtml(row.area) + "</td>" +
      '<td class="cell-price" data-service="haircut" data-label="Men\'s Cut">' + escapeHtml(formatPrice(row.haircut)) + "</td>" +
      '<td class="cell-price" data-service="beard" data-label="Beard">' + escapeHtml(formatPrice(row.beard)) + "</td>" +
      '<td class="cell-price" data-service="students" data-label="Students">' + escapeHtml(formatPrice(row.students)) + "</td>" +
      '<td class="cell-price" data-service="hotTowel" data-label="Hot Towel">' + escapeHtml(formatPrice(row.hotTowel)) + "</td>" +
      '<td class="cell-price" data-service="lineup" data-label="Lineup">' + escapeHtml(formatPrice(row.lineup)) + "</td>" +
      '<td class="cell-count" data-label="Shops">' + escapeHtml(row.shops) + "</td>";
    tbody.appendChild(tr);
  });
}

// --------------- RENDER: COMPETITOR TABLE ---------------

function renderCompetitorTable(data) {
  var tbody = document.getElementById("competitor-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  var list = data || COMPETITORS;
  list.forEach(function (c) {
    var tr = document.createElement("tr");
    tr.innerHTML =
      '<td data-label="Shop Name">' + escapeHtml(c.name) + "</td>" +
      '<td data-label="Neighborhood">' + escapeHtml(c.neighborhood) + "</td>" +
      '<td class="cell-mono" data-label="Zip">' + escapeHtml(c.zip) + "</td>" +
      '<td class="cell-price" data-label="Avg Cut">' + escapeHtml(formatPrice(c.avgCut)) + "</td>" +
      '<td data-label="Rating">' + escapeHtml(c.rating === "—" ? "—" : c.rating.toFixed(1)) + "</td>" +
      '<td data-label="Barbers">' + escapeHtml(c.barbers) + "</td>" +
      '<td data-label="Model">' + escapeHtml(c.model) + "</td>";
    tbody.appendChild(tr);
  });
}

// --------------- RENDER: SOCIAL TABLE ---------------

function renderSocialTable() {
  var tbody = document.getElementById("social-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  SOCIAL_LEADERS.forEach(function (s) {
    var tr = document.createElement("tr");
    tr.innerHTML =
      '<td data-label="#">' + escapeHtml(s.rank) + "</td>" +
      '<td data-label="Name">' + escapeHtml(s.name) + "</td>" +
      '<td data-label="Type">' + escapeHtml(s.type) + "</td>" +
      '<td data-label="Platform">' + escapeHtml(s.platform) + "</td>" +
      '<td data-label="Followers">' + escapeHtml(formatFollowers(s.followers)) + "</td>" +
      '<td data-label="Engagement">' + escapeHtml(s.engagement) + "</td>";
    tbody.appendChild(tr);
  });
}

// --------------- RENDER: MARKET MOVES ---------------

var MOVE_COLORS = {
  "Expansion":      "#22c55e",
  "Price Increase": "#eab308",
  "New Opening":    "#3b82f6",
  "Partnership":    "#a855f7",
  "Rebrand":        "#f97316",
  "Product Launch": "#06b6d4"
};

function renderMoves() {
  var grid = document.getElementById("moves-grid");
  if (!grid) return;
  grid.innerHTML = "";

  if (!MARKET_MOVES || MARKET_MOVES.length === 0) {
    grid.innerHTML =
      '<div class="coming-soon-card">' +
        '<p class="coming-soon-title">Coming Soon</p>' +
        '<p class="coming-soon-desc">We\'re collecting historical data. This section will populate as the market moves.</p>' +
      '</div>';
    return;
  }

  MARKET_MOVES.forEach(function (m) {
    var card = document.createElement("div");
    card.className = "move-card";
    card.style.borderLeft = "4px solid " + (MOVE_COLORS[m.type] || "#6b7280");

    card.innerHTML =
      '<div class="move-card-header">' +
        '<span class="move-type">' + escapeHtml(m.type) + "</span>" +
        '<span class="move-impact move-impact--' + escapeHtml(m.impact.toLowerCase()) + '">' + escapeHtml(m.impact) + " Impact</span>" +
      "</div>" +
      '<h3 class="move-title">' + escapeHtml(m.title) + "</h3>" +
      '<p class="move-detail">' + escapeHtml(m.detail) + "</p>" +
      '<span class="move-date">' + escapeHtml(m.date) + "</span>";

    grid.appendChild(card);
  });
}

// --------------- RENDER: DENSITY ---------------

function renderDensity() {
  var grid = document.getElementById("density-grid");
  if (!grid) return;
  grid.innerHTML = "";

  var maxCount = Math.max.apply(null, DENSITY.map(function (d) { return d.count; }));

  DENSITY.forEach(function (d) {
    var pct = Math.round((d.count / maxCount) * 100);
    var card = document.createElement("div");
    card.className = "density-card";

    card.innerHTML =
      '<div class="density-header">' +
        '<span class="density-zip cell-mono">' + escapeHtml(d.zip) + "</span>" +
        '<span class="density-count">' + escapeHtml(d.count) + " shops</span>" +
      "</div>" +
      '<span class="density-area">' + escapeHtml(d.area) + "</span>" +
      '<div class="density-bar-track">' +
        '<div class="density-bar-fill" style="width:' + pct + '%"></div>' +
      "</div>";

    grid.appendChild(card);
  });
}

// --------------- INTERACTIVITY: FILTER BUTTONS ---------------

function setupFilterButtons() {
  var buttons = document.querySelectorAll(".dash-filter-btn");
  if (!buttons.length) return;

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      // Toggle active class
      buttons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");

      var service = btn.getAttribute("data-service");
      highlightServiceColumn(service);
    });
  });
}

function highlightServiceColumn(service) {
  var table = document.getElementById("pricing-table");
  if (!table) return;

  // Remove existing highlights
  var highlighted = table.querySelectorAll(".col-highlight");
  highlighted.forEach(function (el) { el.classList.remove("col-highlight"); });

  if (service === "all") return;

  // Highlight matching cells in tbody
  var cells = table.querySelectorAll('td[data-service="' + service + '"]');
  cells.forEach(function (cell) { cell.classList.add("col-highlight"); });

  // Also highlight the corresponding header
  var serviceToColIndex = { haircut: 2, beard: 3, students: 4, hotTowel: 5, lineup: 6 };
  var colIdx = serviceToColIndex[service];
  if (colIdx !== undefined) {
    var ths = table.querySelectorAll("thead th");
    if (ths[colIdx]) ths[colIdx].classList.add("col-highlight");
  }
}

// --------------- INTERACTIVITY: COMPETITOR SEARCH ---------------

function setupCompetitorSearch() {
  var input = document.getElementById("competitor-search");
  if (!input) return;

  input.addEventListener("input", function () {
    var query = input.value.toLowerCase().trim();

    if (!query) {
      renderCompetitorTable(COMPETITORS);
      return;
    }

    var filtered = COMPETITORS.filter(function (c) {
      return (
        c.name.toLowerCase().indexOf(query) !== -1 ||
        c.neighborhood.toLowerCase().indexOf(query) !== -1 ||
        c.zip.indexOf(query) !== -1 ||
        c.model.toLowerCase().indexOf(query) !== -1 ||
        c.tier.toLowerCase().indexOf(query) !== -1
      );
    });

    renderCompetitorTable(filtered);
  });
}

// --------------- INTERACTIVITY: SORTABLE TABLES ---------------

var sortState = {};

function makeSortable(tableId, dataSource, renderFn) {
  var table = document.getElementById(tableId);
  if (!table) return;

  var headers = table.querySelectorAll("thead th");
  headers.forEach(function (th, colIndex) {
    th.style.cursor = "pointer";
    th.setAttribute("data-col-index", colIndex);

    th.addEventListener("click", function () {
      var key = tableId + "-" + colIndex;
      var ascending = sortState[key] === "asc" ? false : true;
      sortState[key] = ascending ? "asc" : "desc";

      // Clear arrows from sibling headers
      headers.forEach(function (h) {
        var arrow = h.querySelector(".sort-arrow");
        if (arrow) arrow.remove();
      });

      // Add arrow to clicked header
      var arrow = document.createElement("span");
      arrow.className = "sort-arrow";
      arrow.textContent = ascending ? " \u25B2" : " \u25BC";
      th.appendChild(arrow);

      // Sort the data
      var sorted = dataSource.slice().sort(function (a, b) {
        var keys = Object.keys(a);
        var field = keys[colIndex];
        var valA = a[field];
        var valB = b[field];

        if (typeof valA === "string") {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
          if (valA < valB) return ascending ? -1 : 1;
          if (valA > valB) return ascending ? 1 : -1;
          return 0;
        }

        return ascending ? valA - valB : valB - valA;
      });

      renderFn(sorted);
    });
  });
}

function renderPricingTableFromData(data) {
  var tbody = document.getElementById("pricing-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  data.forEach(function (row) {
    var tr = document.createElement("tr");
    tr.innerHTML =
      '<td class="cell-mono" data-label="Zip">' + escapeHtml(row.zip) + "</td>" +
      '<td data-label="Area">' + escapeHtml(row.area) + "</td>" +
      '<td class="cell-price" data-service="haircut" data-label="Men\'s Cut">' + escapeHtml(formatPrice(row.haircut)) + "</td>" +
      '<td class="cell-price" data-service="beard" data-label="Beard">' + escapeHtml(formatPrice(row.beard)) + "</td>" +
      '<td class="cell-price" data-service="students" data-label="Students">' + escapeHtml(formatPrice(row.students)) + "</td>" +
      '<td class="cell-price" data-service="hotTowel" data-label="Hot Towel">' + escapeHtml(formatPrice(row.hotTowel)) + "</td>" +
      '<td class="cell-price" data-service="lineup" data-label="Lineup">' + escapeHtml(formatPrice(row.lineup)) + "</td>" +
      '<td class="cell-count" data-label="Shops">' + escapeHtml(row.shops) + "</td>";
    tbody.appendChild(tr);
  });

  // Re-apply any active service highlight
  var activeBtn = document.querySelector(".dash-filter-btn.active");
  if (activeBtn) {
    var service = activeBtn.getAttribute("data-service");
    if (service !== "all") highlightServiceColumn(service);
  }
}

// --------------- RENDER: HEAT MAP ---------------

var _heatmapExpandedZip = null;

function getHeatMapStrengths(entry) {
  var strengths = [];

  // Find extremes across all zip data
  var allPrices = [], allShops = [], allSpreads = [];
  PRICING_BY_ZIP.forEach(function (z) {
    var p = z.haircut;
    if (typeof p === 'number') allPrices.push({ zip: z.zip, price: p });
    allShops.push({ zip: z.zip, count: z.shops });

    // Calculate price spread
    var services = [z.haircut, z.beard, z.students, z.hotTowel, z.lineup];
    var nums = [];
    services.forEach(function (s) { if (typeof s === 'number') nums.push(s); });
    if (nums.length > 1) {
      allSpreads.push({ zip: z.zip, spread: Math.max.apply(null, nums) - Math.min.apply(null, nums) });
    }
  });

  if (allPrices.length > 0) {
    allPrices.sort(function (a, b) { return a.price - b.price; });
    if (allPrices[0].zip === entry.zip) strengths.push('Budget-friendly zone');
    if (allPrices[allPrices.length - 1].zip === entry.zip) strengths.push('Premium pricing area');
  }

  allShops.sort(function (a, b) { return b.count - a.count; });
  if (allShops[0].zip === entry.zip) strengths.push('High competition area');
  if (allShops[allShops.length - 1].zip === entry.zip) strengths.push('Underserved market');

  if (allSpreads.length > 0) {
    allSpreads.sort(function (a, b) { return b.spread - a.spread; });
    if (allSpreads[0].zip === entry.zip) strengths.push('Diverse pricing');
  }

  // Fallback: generate a contextual strength if none matched
  if (strengths.length === 0) {
    if (entry.shops >= 5) strengths.push('Established market');
    else if (entry.shops <= 2) strengths.push('Growth opportunity');
    else strengths.push('Mid-market area');
  }

  return strengths;
}

function buildDetailPanel(entry) {
  var strengths = getHeatMapStrengths(entry);

  // Get competitors in this zip
  var comps = COMPETITORS.filter(function (c) { return c.zip === entry.zip; });

  var services = [
    { label: "Men's Cut", value: entry.haircut },
    { label: 'Beard', value: entry.beard },
    { label: 'Students', value: entry.students },
    { label: 'Hot Towel', value: entry.hotTowel },
    { label: 'Lineup', value: entry.lineup }
  ];

  var servicesHtml = '';
  services.forEach(function (s) {
    var val = (typeof s.value === 'number') ? '$' + s.value : 'N/A';
    var cls = (typeof s.value === 'number') ? '' : ' heatmap-detail-na';
    servicesHtml += '<div class="heatmap-detail-service' + cls + '">' +
      '<span class="heatmap-detail-service-label">' + escapeHtml(s.label) + '</span>' +
      '<span class="heatmap-detail-service-value">' + escapeHtml(val) + '</span>' +
    '</div>';
  });

  var strengthsHtml = '';
  strengths.forEach(function (s) {
    strengthsHtml += '<span class="heatmap-strength-tag">' + escapeHtml(s) + '</span>';
  });

  var compsHtml = '';
  if (comps.length > 0) {
    compsHtml = '<div class="heatmap-detail-comps">' +
      '<h4 class="heatmap-detail-comps-title">Shops in this area (' + comps.length + ')</h4>' +
      '<div class="heatmap-detail-comps-list">';
    comps.forEach(function (c) {
      var avgText = (typeof c.avgCut === 'number') ? '$' + c.avgCut : 'N/A';
      var ratingText = (typeof c.rating === 'number') ? c.rating.toFixed(1) : 'N/A';
      compsHtml += '<div class="heatmap-comp-row">' +
        '<span class="heatmap-comp-name">' + escapeHtml(c.name) + '</span>' +
        '<span class="heatmap-comp-meta">' + escapeHtml(avgText) + ' · ' + escapeHtml(ratingText) + '★ · ' + escapeHtml(c.model) + '</span>' +
      '</div>';
    });
    compsHtml += '</div></div>';
  }

  return '<div class="heatmap-detail-panel" role="region" aria-label="Details for zip code ' + escapeHtml(entry.zip) + '">' +
    '<div class="heatmap-detail-header">' +
      '<h3 class="heatmap-detail-title">' + escapeHtml(entry.zip) + ' — ' + escapeHtml(entry.area) + '</h3>' +
      '<span class="heatmap-detail-shopcount">' + escapeHtml(entry.shops) + ' shop' + (entry.shops !== 1 ? 's' : '') + ' tracked</span>' +
    '</div>' +
    '<div class="heatmap-detail-strengths">' + strengthsHtml + '</div>' +
    '<div class="heatmap-detail-services">' + servicesHtml + '</div>' +
    compsHtml +
  '</div>';
}

function renderHeatMap(service) {
  service = service || 'haircut';
  var grid = document.getElementById('heatmap-grid');
  if (!grid) return;

  // Calculate dynamic min/max from data
  var dataPoints = [];
  PRICING_BY_ZIP.forEach(function (entry) {
    var price = entry[service];
    if (typeof price === 'number') dataPoints.push(price);
  });

  var MIN_PRICE = dataPoints.length > 0 ? Math.min.apply(null, dataPoints) : 20;
  var MAX_PRICE = dataPoints.length > 0 ? Math.max.apply(null, dataPoints) : 65;
  if (MIN_PRICE === MAX_PRICE) { MIN_PRICE -= 5; MAX_PRICE += 5; }

  var withPrice = [];
  var noData = [];

  PRICING_BY_ZIP.forEach(function (entry) {
    var price = entry[service];
    if (price === '—' || price === undefined || price === null || price === '') {
      noData.push(entry);
    } else {
      withPrice.push({ entry: entry, price: Number(price) });
    }
  });

  withPrice.sort(function (a, b) { return b.price - a.price; });
  grid.innerHTML = '';

  // Muted dark-theme gradient: dark teal → muted amber → muted red
  function interpolateColor(price) {
    var t = (price - MIN_PRICE) / (MAX_PRICE - MIN_PRICE);
    t = Math.max(0, Math.min(1, t));
    var r, g, b;
    if (t < 0.5) {
      // dark teal → muted amber
      var u = t / 0.5;
      r = Math.round(30 + (140 - 30) * u);
      g = Math.round(80 + (100 - 80) * u);
      b = Math.round(60 + (30 - 60) * u);
    } else {
      // muted amber → muted red
      var u = (t - 0.5) / 0.5;
      r = Math.round(140 + (160 - 140) * u);
      g = Math.round(100 + (40 - 100) * u);
      b = Math.round(30 + (40 - 30) * u);
    }
    return { r: r, g: g, b: b };
  }

  function handleTileClick(entry, wrapper) {
    var wasExpanded = _heatmapExpandedZip === entry.zip;

    // Collapse any previously expanded tile
    var prev = grid.querySelector('.heatmap-wrapper--expanded');
    if (prev) {
      prev.classList.remove('heatmap-wrapper--expanded');
      var prevPanel = prev.querySelector('.heatmap-detail-panel');
      if (prevPanel) prevPanel.remove();
      var prevTile = prev.querySelector('.heatmap-tile');
      if (prevTile) {
        prevTile.classList.remove('heatmap-tile--active');
        prevTile.setAttribute('aria-expanded', 'false');
      }
    }
    _heatmapExpandedZip = null;

    // If clicking the same tile, just collapse
    if (wasExpanded) return;

    // Expand the clicked tile
    _heatmapExpandedZip = entry.zip;
    wrapper.classList.add('heatmap-wrapper--expanded');
    var tile = wrapper.querySelector('.heatmap-tile');
    if (tile) {
      tile.classList.add('heatmap-tile--active');
      tile.setAttribute('aria-expanded', 'true');
    }

    var panelHtml = buildDetailPanel(entry);
    var panelContainer = document.createElement('div');
    panelContainer.innerHTML = panelHtml;
    wrapper.appendChild(panelContainer.firstChild);
  }

  function createTile(entry, price, hasData) {
    var wrapper = document.createElement('div');
    wrapper.className = 'heatmap-wrapper';

    var tile = document.createElement('button');
    tile.className = 'heatmap-tile';
    tile.setAttribute('type', 'button');
    tile.setAttribute('aria-expanded', 'false');
    tile.setAttribute('aria-label', 'Zip code ' + entry.zip + ', ' + entry.area +
      (hasData ? ', $' + price : ', no price data') + ', ' + entry.shops + ' shop' + (entry.shops !== 1 ? 's' : ''));

    if (hasData) {
      var color = interpolateColor(price);
      var intensity = Math.max(0, Math.min(1, (price - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)));
      tile.style.backgroundColor = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
      tile.style.boxShadow = '0 0 ' + Math.round(4 + intensity * 8) + 'px rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + (0.15 + intensity * 0.25).toFixed(2) + ')';
      tile.style.border = '1px solid rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + (0.3 + intensity * 0.3).toFixed(2) + ')';
      if (intensity > 0.66) tile.classList.add('heatmap-tile--hot');

      var priceLabel = '';
      if (intensity < 0.33) priceLabel = 'Low';
      else if (intensity < 0.66) priceLabel = 'Mid';
      else priceLabel = 'High';

      tile.innerHTML =
        '<div class="heatmap-tile-top">' +
          '<div class="heatmap-zip">' + escapeHtml(entry.zip) + '</div>' +
          '<span class="heatmap-shop-badge" aria-label="' + entry.shops + ' shops">' + escapeHtml(entry.shops) + '</span>' +
        '</div>' +
        '<div class="heatmap-area">' + escapeHtml(entry.area) + '</div>' +
        '<div class="heatmap-price-row">' +
          '<span class="heatmap-price">$' + escapeHtml(price) + '</span>' +
          '<span class="heatmap-price-label">' + priceLabel + '</span>' +
        '</div>' +
        '<div class="heatmap-shops">' + escapeHtml(entry.shops) + ' shop' + (entry.shops !== 1 ? 's' : '') + '</div>';
    } else {
      tile.style.backgroundColor = 'rgba(255,255,255,0.03)';
      tile.style.border = '1px solid rgba(255,255,255,0.06)';

      tile.innerHTML =
        '<div class="heatmap-tile-top">' +
          '<div class="heatmap-zip">' + escapeHtml(entry.zip) + '</div>' +
          '<span class="heatmap-shop-badge" aria-label="' + entry.shops + ' shops">' + escapeHtml(entry.shops) + '</span>' +
        '</div>' +
        '<div class="heatmap-area">' + escapeHtml(entry.area) + '</div>' +
        '<span class="heatmap-nodata">NO DATA</span>' +
        '<div class="heatmap-shops">' + escapeHtml(entry.shops) + ' shop' + (entry.shops !== 1 ? 's' : '') + '</div>';
    }

    tile.addEventListener('click', function () { handleTileClick(entry, wrapper); });

    wrapper.appendChild(tile);

    // Re-expand if this was the previously expanded zip
    if (_heatmapExpandedZip === entry.zip) {
      wrapper.classList.add('heatmap-wrapper--expanded');
      tile.classList.add('heatmap-tile--active');
      tile.setAttribute('aria-expanded', 'true');
      var panelHtml = buildDetailPanel(entry);
      var panelContainer = document.createElement('div');
      panelContainer.innerHTML = panelHtml;
      wrapper.appendChild(panelContainer.firstChild);
    }

    return wrapper;
  }

  withPrice.forEach(function (item) {
    grid.appendChild(createTile(item.entry, item.price, true));
  });
  noData.forEach(function (entry) {
    grid.appendChild(createTile(entry, null, false));
  });

  // Update legend labels dynamically
  var legendLabels = document.querySelector('.heatmap-legend-labels');
  if (legendLabels) {
    var spans = legendLabels.querySelectorAll('span');
    // Update the price labels (skip the first "No Data" span)
    if (spans.length >= 5) {
      var range = MAX_PRICE - MIN_PRICE;
      spans[1].textContent = '$' + MIN_PRICE;
      spans[2].textContent = '$' + Math.round(MIN_PRICE + range * 0.33);
      spans[3].textContent = '$' + Math.round(MIN_PRICE + range * 0.66);
      spans[4].textContent = '$' + MAX_PRICE;
    }
  }
}

function setupHeatMapButtons() {
  var buttons = document.querySelectorAll('.heatmap-filter-btn');
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      _heatmapExpandedZip = null; // collapse on service change
      renderHeatMap(btn.getAttribute('data-service') || 'haircut');
    });
  });
}

// --------------- RENDER: INTERACTIVE TOOLS ---------------

function renderPriceCompare() {
  var container = document.getElementById('tool-price-compare');
  if (!container) return;

  var marketMin = 20, marketMax = 65, marketAvg = 34;
  var zipOptions = '';
  PRICING_BY_ZIP.forEach(function (d) {
    zipOptions += '<option value="' + escapeHtml(d.zip) + '">' + escapeHtml(d.zip) + ' \u2014 ' + escapeHtml(d.area) + '</option>';
  });

  container.innerHTML =
    '<h3 class="tool-card-title">Price Comparison Calculator</h3>' +
    '<p class="tool-card-desc">See how your pricing stacks up against your neighborhood and the Charlotte market</p>' +
    '<div class="tool-inputs">' +
      '<div class="tool-input-group">' +
        '<label>Your Men\'s Cut Price</label>' +
        '<input type="number" id="tool-pc-price" min="0" max="200" step="1" value="30" placeholder="$30">' +
      '</div>' +
      '<div class="tool-input-group">' +
        '<label>Your Zip Code</label>' +
        '<select id="tool-pc-zip">' + zipOptions + '</select>' +
      '</div>' +
    '</div>' +
    '<div class="tool-result" id="tool-pc-results"></div>';

  var priceInput = document.getElementById('tool-pc-price');
  var zipSelect = document.getElementById('tool-pc-zip');
  var resultsDiv = document.getElementById('tool-pc-results');

  function update() {
    var userPrice = parseFloat(priceInput.value);
    var zipData = PRICING_BY_ZIP.find(function (d) { return d.zip === zipSelect.value; });
    if (isNaN(userPrice) || !zipData) { resultsDiv.innerHTML = ''; return; }

    var areaAvg = zipData.haircut;
    if (areaAvg === '—' || !areaAvg) {
      resultsDiv.innerHTML =
        '<div class="tool-result-line">No pricing data available for ' + escapeHtml(zipData.area) + ' yet.</div>' +
        '<div class="tool-result-line">Market-wide average: <strong>$' + escapeHtml(marketAvg) + '</strong></div>';
      return;
    }

    var diff = userPrice - areaAvg;
    var diffAbs = Math.abs(diff).toFixed(0);
    var diffLabel = diff > 0
      ? '<span class="tool-above">+$' + escapeHtml(diffAbs) + ' above market</span>'
      : diff < 0
        ? '<span class="tool-below">-$' + escapeHtml(diffAbs) + ' below market</span>'
        : '<span style="color:var(--gray-300);">At market rate</span>';

    var barPos = Math.max(0, Math.min(100, ((userPrice - marketMin) / (marketMax - marketMin)) * 100));
    var avgPos = ((marketAvg - marketMin) / (marketMax - marketMin)) * 100;
    var areaPos = ((areaAvg - marketMin) / (marketMax - marketMin)) * 100;

    resultsDiv.innerHTML =
      '<div class="tool-result-line">You charge <strong>$' + escapeHtml(userPrice.toFixed(0)) + '</strong>. Average in <strong>' + escapeHtml(zipData.area) + '</strong> is <strong>$' + escapeHtml(areaAvg) + '</strong>.</div>' +
      '<div class="tool-result-line">' + diffLabel + '</div>' +
      '<div class="tool-result-line" style="color:var(--gray-500);font-size:13px;">Market-wide average: $' + escapeHtml(marketAvg) + '</div>' +
      '<div class="tool-compare-bar">' +
        '<div class="tool-compare-line" style="left:' + avgPos + '%" title="Market avg"></div>' +
        '<div class="tool-compare-line tool-compare-line--area" style="left:' + areaPos + '%" title="Area avg"></div>' +
        '<div class="tool-compare-marker" style="left:' + barPos + '%"></div>' +
      '</div>' +
      '<div style="display:flex;gap:16px;font-size:11px;color:var(--gray-500);margin-top:8px;">' +
        '<span style="display:flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;border-radius:50%;background:var(--accent);"></span> Your price</span>' +
        '<span style="display:flex;align-items:center;gap:4px;"><span style="width:10px;height:2px;background:var(--green);"></span> Area avg</span>' +
        '<span style="display:flex;align-items:center;gap:4px;"><span style="width:10px;height:2px;background:var(--gray-500);"></span> Market avg</span>' +
      '</div>';
  }

  priceInput.addEventListener('input', update);
  zipSelect.addEventListener('change', update);
  update();
}

function renderRevenueEstimator() {
  var container = document.getElementById('tool-revenue');
  if (!container) return;

  container.innerHTML =
    '<h3 class="tool-card-title">Revenue Estimator</h3>' +
    '<p class="tool-card-desc">Estimate your daily, weekly, monthly, and annual revenue</p>' +
    '<div class="tool-inputs">' +
      '<div class="tool-input-group">' +
        '<label>Avg Price per Cut</label>' +
        '<input type="number" id="tool-rev-price" min="0" max="500" step="1" value="35">' +
      '</div>' +
      '<div class="tool-input-group">' +
        '<label>Clients per Day</label>' +
        '<input type="number" id="tool-rev-clients" min="0" max="100" step="1" value="12">' +
      '</div>' +
      '<div class="tool-input-group">' +
        '<label>Days per Week</label>' +
        '<input type="number" id="tool-rev-days" min="1" max="7" step="1" value="5">' +
      '</div>' +
    '</div>' +
    '<div class="tool-result" id="tool-rev-results"></div>';

  var priceInput = document.getElementById('tool-rev-price');
  var clientsInput = document.getElementById('tool-rev-clients');
  var daysInput = document.getElementById('tool-rev-days');
  var resultsDiv = document.getElementById('tool-rev-results');

  function fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); }

  function update() {
    var price = parseFloat(priceInput.value) || 0;
    var clients = parseFloat(clientsInput.value) || 0;
    var days = parseFloat(daysInput.value) || 0;
    var daily = price * clients;
    var weekly = daily * days;
    var monthly = weekly * 4.33;
    var annual = weekly * 52;

    resultsDiv.innerHTML =
      '<div class="tool-revenue-grid">' +
        '<div class="tool-revenue-card"><span class="tool-revenue-label">Daily</span><span class="tool-revenue-value">' + escapeHtml(fmt(daily)) + '</span></div>' +
        '<div class="tool-revenue-card"><span class="tool-revenue-label">Weekly</span><span class="tool-revenue-value">' + escapeHtml(fmt(weekly)) + '</span></div>' +
        '<div class="tool-revenue-card"><span class="tool-revenue-label">Monthly</span><span class="tool-revenue-value">' + escapeHtml(fmt(monthly)) + '</span></div>' +
        '<div class="tool-revenue-card"><span class="tool-revenue-label">Annual</span><span class="tool-revenue-value tool-revenue-value--annual">' + escapeHtml(fmt(annual)) + '</span></div>' +
      '</div>' +
      '<p style="margin:12px 0 0;font-size:11px;color:var(--gray-500);">' + escapeHtml(clients) + ' clients/day x ' + escapeHtml(fmt(price)) + '/cut x ' + escapeHtml(days) + ' days/week. Monthly uses 4.33 weeks.</p>';
  }

  priceInput.addEventListener('input', update);
  clientsInput.addEventListener('input', update);
  daysInput.addEventListener('input', update);
  update();
}

function renderGapFinder() {
  var container = document.getElementById('tool-gap-finder');
  if (!container) return;

  var maxShops = Math.max.apply(null, PRICING_BY_ZIP.map(function (d) { return d.shops || 0; }));
  var allPrices = PRICING_BY_ZIP.map(function (d) { return d.haircut; }).filter(function (p) { return typeof p === 'number' && p > 0; });
  var overallAvg = allPrices.length > 0 ? allPrices.reduce(function (a, b) { return a + b; }, 0) / allPrices.length : 33;

  var allCompetitors = window._reupAllShops || COMPETITORS;
  var maxComps = 0;
  PRICING_BY_ZIP.forEach(function (e) {
    var c = allCompetitors.filter(function (comp) { return comp.zip === e.zip; }).length;
    if (c > maxComps) maxComps = c;
  });
  if (maxComps === 0) maxComps = 1;

  var scored = PRICING_BY_ZIP.map(function (entry) {
    var shopCount = entry.shops || 0;
    var avgPrice = typeof entry.haircut === 'number' ? entry.haircut : 0;
    var competitorCount = allCompetitors.filter(function (c) { return c.zip === entry.zip; }).length;

    var saturationScore = Math.max(0, 50 * (1 - (shopCount / maxShops)));
    var priceScore = avgPrice > 0 ? Math.min(30, 30 * (avgPrice / overallAvg)) : 20;
    var compScore = Math.max(0, 20 * (1 - (competitorCount / maxComps)));
    var totalScore = Math.round(saturationScore + priceScore + compScore);

    var tier, tierClass;
    if (totalScore >= 65) { tier = 'High Opportunity'; tierClass = 'high'; }
    else if (totalScore >= 45) { tier = 'Medium'; tierClass = 'medium'; }
    else { tier = 'Saturated'; tierClass = 'saturated'; }

    return { zip: entry.zip, area: entry.area, shops: shopCount, avgPrice: avgPrice, competitors: competitorCount, score: totalScore, tier: tier, tierClass: tierClass };
  });

  scored.sort(function (a, b) { return b.score - a.score; });

  var listHtml = '';
  scored.forEach(function (item, idx) {
    listHtml +=
      '<div class="tool-gap-item" data-opportunity="' + escapeHtml(item.tierClass) + '">' +
        '<span class="tool-gap-rank">#' + escapeHtml(idx + 1) + '</span>' +
        '<span class="tool-gap-zip">' + escapeHtml(item.zip) + '</span>' +
        '<span class="tool-gap-area">' + escapeHtml(item.area) + '</span>' +
        '<span class="tool-gap-shops">' + escapeHtml(item.shops) + ' shop' + (item.shops !== 1 ? 's' : '') + '</span>' +
        '<span class="tool-gap-badge tool-gap-badge--' + escapeHtml(item.tierClass) + '">' + escapeHtml(item.tier) + '</span>' +
      '</div>';
  });

  container.innerHTML =
    '<h3 class="tool-card-title">Market Gap Finder</h3>' +
    '<p class="tool-card-desc">Zip codes ranked by opportunity — fewer shops and higher pricing signals room to grow</p>' +
    '<div class="tool-gap-list">' + listHtml + '</div>' +
    '<p class="tool-gap-method">Score based on: shop saturation (50pts), price headroom (30pts), competitor density (20pts). Higher score = more opportunity.</p>';
}

// --------------- GUIDED TOUR / ONBOARDING ---------------

var TOUR_STEPS = [
  {
    target: null, // welcome screen — no target
    title: 'Welcome to RE UP Intel',
    body: 'You just unlocked the most detailed barbershop market data in Charlotte. This is your command center — real prices, real competitors, real opportunities. Let us show you around.',
    cta: 'Show Me Around',
    icon: 'welcome'
  },
  {
    target: '#heatmap-grid',
    title: 'Pricing Heat Map',
    body: 'This is your bird\'s-eye view of Charlotte pricing. The redder the tile, the more expensive that zip code is. Dark tiles = cheaper areas. Tap the buttons up top to switch between Men\'s Cut, Beard, and Students.',
    tip: 'Use this to see which neighborhoods charge premium and where the value shops are.',
    cta: 'Next'
  },
  {
    target: '#pricing-table',
    title: 'Pricing by Zip Code',
    body: 'Every row is a zip code. Every column is a service. This is what shops in that area actually charge — pulled from Booksy, Squire, Fresha, and shop websites. Click any column header to sort.',
    tip: 'Use the filter buttons above the table to highlight one service at a time.',
    cta: 'Next'
  },
  {
    target: '#tool-price-compare',
    title: 'Price Comparison Tool',
    body: 'Type in what you charge and pick your zip code. It instantly shows whether you\'re above or below the local average. The red dot on the bar is you — the lines are your area average and the whole-market average.',
    tip: 'If you\'re $5+ below your area, you might be leaving money on the table.',
    cta: 'Next'
  },
  {
    target: '#tool-revenue',
    title: 'Revenue Estimator',
    body: 'Plug in your price per cut, how many clients you see per day, and how many days you work. It calculates your daily, weekly, monthly, and annual revenue. Change any number and watch it update live.',
    tip: 'Try bumping your price by $5 — see how much that adds up over a year.',
    cta: 'Next'
  },
  {
    target: '#tool-gap-finder',
    title: 'Market Gap Finder',
    body: 'We scored every Charlotte zip code on how much room there is for a new barber. Green = high opportunity (few shops, good pricing). Red = saturated (lots of competition). This runs automatically from our data.',
    tip: 'Thinking about a second chair or new location? Start here.',
    cta: 'Next'
  },
  {
    target: '#competitor-table',
    title: 'Competitor Directory',
    body: 'Every barbershop we track in Charlotte — 170+ shops with their pricing, ratings, barber count, and business model. Use the search bar to find any shop by name, neighborhood, or zip code.',
    tip: 'Sort by "Avg Cut" to see who\'s charging the most in your area.',
    cta: 'Next'
  },
  {
    target: '#social-table',
    title: 'Social Leaderboard',
    body: 'See which Charlotte shops and barbers have the biggest Instagram following. This tells you who\'s winning the local conversation and whose brand is growing the fastest.',
    tip: 'If a competitor in your zip has 5x your followers, they\'re probably capturing walk-ins you\'re missing.',
    cta: 'Next'
  },
  {
    target: '#density-grid',
    title: 'Shop Density Map',
    body: 'See how many shops are packed into each zip code. The bigger the bar, the more shops. This is the competition heatmap — find the crowded zones and the gaps.',
    tip: 'Low-density zips with growing neighborhoods = best expansion targets.',
    cta: 'Got It'
  }
];

function shouldShowTour() {
  return !localStorage.getItem('reup_tour_done');
}

function completeTour() {
  localStorage.setItem('reup_tour_done', '1');
}

function startGuidedTour() {
  if (!shouldShowTour()) return;

  var currentStep = 0;
  var highlightedEl = null;

  // Create dark overlay — covers everything, target gets elevated above it
  var overlay = document.createElement('div');
  overlay.id = 'tour-overlay';
  overlay.className = 'tour-overlay tour-overlay--active';
  document.body.appendChild(overlay);

  // Create tooltip
  var tooltip = document.createElement('div');
  tooltip.id = 'tour-tooltip';
  tooltip.className = 'tour-tooltip';
  document.body.appendChild(tooltip);

  function clearHighlight() {
    if (highlightedEl) {
      highlightedEl.classList.remove('tour-highlight');
      highlightedEl.style.position = '';
      highlightedEl.style.zIndex = '';
      highlightedEl = null;
    }
  }

  function renderStep(idx) {
    var step = TOUR_STEPS[idx];
    var totalSteps = TOUR_STEPS.length;
    var isWelcome = idx === 0;
    var isLast = idx === totalSteps - 1;

    // Build dots
    var dotsHtml = '<div class="tour-dots">';
    for (var d = 0; d < totalSteps; d++) {
      dotsHtml += '<span class="tour-dot' + (d === idx ? ' tour-dot--active' : '') + (d < idx ? ' tour-dot--done' : '') + '"></span>';
    }
    dotsHtml += '</div>';

    // Build tip callout
    var tipHtml = step.tip
      ? '<div class="tour-tip"><span class="tour-tip-icon">&rarr;</span> ' + escapeHtml(step.tip) + '</div>'
      : '';

    // Build tooltip content
    tooltip.innerHTML =
      (isWelcome ? '<div class="tour-welcome-badge">RE UP INTEL</div>' : '') +
      '<div class="tour-step-counter">Step ' + escapeHtml(idx + 1) + ' of ' + escapeHtml(totalSteps) + '</div>' +
      '<h2 class="tour-title">' + escapeHtml(step.title) + '</h2>' +
      '<p class="tour-body">' + escapeHtml(step.body) + '</p>' +
      tipHtml +
      dotsHtml +
      '<div class="tour-actions">' +
        (idx > 0 ? '<button class="tour-btn tour-btn--back" id="tour-back">Back</button>' : '') +
        '<button class="tour-btn tour-btn--primary" id="tour-next">' + escapeHtml(step.cta) + '</button>' +
      '</div>' +
      (isLast ? '' : '<button class="tour-skip" id="tour-skip">Skip tour</button>');

    // Clear previous highlight
    clearHighlight();

    if (isWelcome) {
      tooltip.className = 'tour-tooltip tour-tooltip--welcome';
      tooltip.style.top = '';
      tooltip.style.left = '';
    } else {
      tooltip.className = 'tour-tooltip tour-tooltip--positioned';

      var target = document.querySelector(step.target);
      if (target) {
        // Elevate the target above the overlay
        highlightedEl = target;
        target.classList.add('tour-highlight');
        target.style.position = 'relative';
        target.style.zIndex = '10001';

        // Scroll target into view
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Position tooltip after scroll completes
        setTimeout(function () {
          positionTooltip(target);
        }, 450);
      }
    }

    // Wire buttons
    var nextBtn = document.getElementById('tour-next');
    var backBtn = document.getElementById('tour-back');
    var skipBtn = document.getElementById('tour-skip');

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        if (idx < totalSteps - 1) {
          currentStep++;
          renderStep(currentStep);
        } else {
          endTour();
        }
      });
    }
    if (backBtn) {
      backBtn.addEventListener('click', function () {
        if (idx > 0) {
          currentStep--;
          renderStep(currentStep);
        }
      });
    }
    if (skipBtn) {
      skipBtn.addEventListener('click', function () {
        endTour();
      });
    }
  }

  function positionTooltip(target) {
    var rect = target.getBoundingClientRect();
    var viewW = window.innerWidth;
    var viewH = window.innerHeight;

    // Reset so we can measure natural size
    tooltip.style.top = '0';
    tooltip.style.left = '0';
    tooltip.style.visibility = 'hidden';
    var tooltipRect = tooltip.getBoundingClientRect();
    tooltip.style.visibility = '';

    var pad = 16;
    var tooltipW = tooltipRect.width;
    var tooltipH = tooltipRect.height;

    // Try below target first
    var top = rect.bottom + pad;
    var left = rect.left + (rect.width / 2) - (tooltipW / 2);

    // If below doesn't fit, try above
    if (top + tooltipH > viewH - pad) {
      top = rect.top - tooltipH - pad;
    }

    // If above doesn't fit either, center vertically in viewport
    if (top < pad) {
      top = Math.max(pad, (viewH - tooltipH) / 2);
    }

    // Clamp horizontal
    if (left < pad) left = pad;
    if (left + tooltipW > viewW - pad) left = viewW - tooltipW - pad;

    tooltip.style.top = top + 'px';
    tooltip.style.left = left + 'px';
  }

  function endTour() {
    completeTour();
    clearHighlight();
    overlay.classList.add('tour-overlay--exiting');
    tooltip.classList.add('tour-tooltip--exiting');
    setTimeout(function () {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip);
    }, 400);
  }

  // Kick off
  renderStep(0);
}

// --------------- PAYWALL GATE ---------------

function applyDashPaywall() {
  var gated = document.getElementById('dash-gated');
  if (!gated) return;

  // Show a blurred teaser of the first table (pricing), hide the rest
  // Render just the pricing table so there's content to blur
  renderPricingTable();

  // Get all sections inside gated
  var sections = gated.querySelectorAll('.dash-section');
  for (var i = 1; i < sections.length; i++) {
    sections[i].style.display = 'none';
  }

  // Apply blur class to the gated container
  gated.classList.add('dash-gated--locked');

  // Insert paywall after the gated container
  var paywallDiv = document.createElement('div');
  paywallDiv.innerHTML = buildDashPaywall();
  gated.parentNode.insertBefore(paywallDiv.firstChild, gated.nextSibling);

  // Attach CTA handlers — show inline waitlist form
  var buttons = document.querySelectorAll('.paywall-cta');
  for (var b = 0; b < buttons.length; b++) {
    buttons[b].addEventListener('click', function () {
      var btn = this;
      // Create a container where the button is, then replace button with waitlist form
      var formContainer = document.createElement('div');
      btn.parentNode.replaceChild(formContainer, btn);
      window.showWaitlistForm(formContainer);
    });
  }
}

// --------------- GOOGLE DATA INTEGRATION ---------------
// When enriched Google Places data arrives, merge with DB data and re-render all sections

function handleGoogleDataLoaded(event) {
  var googleShops = event.detail.shops || [];
  var googleStats = event.detail.stats || {};
  if (!googleShops.length) return;

  // Build a lookup of DB shop names for dedup
  var dbNames = {};
  COMPETITORS.forEach(function(c) { dbNames[c.name.toLowerCase().trim()] = true; });

  // Convert Google shops to competitor format, deduplicating against DB
  var googleCompetitors = [];
  googleShops.forEach(function(shop) {
    var lowerName = shop.name.toLowerCase().trim();
    // Skip if already in DB (exact or fuzzy match)
    var isDupe = dbNames[lowerName];
    if (!isDupe) {
      Object.keys(dbNames).forEach(function(dbName) {
        if (!isDupe && (dbName.indexOf(lowerName) !== -1 || lowerName.indexOf(dbName) !== -1)) {
          isDupe = true;
        }
      });
    }
    if (isDupe) return;
    dbNames[lowerName] = true;

    googleCompetitors.push({
      name: shop.name,
      neighborhood: shop.address || '',
      zip: shop.derived_zip || '',
      avgCut: shop.estimated_haircut || '\u2014',
      rating: shop.rating || '\u2014',
      barbers: shop.barber_count || '\u2014',
      model: '\u2014',
      tier: shop.estimated_tier || 'Mid-tier',
      source: 'google',
      pricing_source: shop.pricing_source || null,
      price_level: shop.price_level || null,
      booking_platform: shop.booking_platform || null,
      total_ratings: shop.total_ratings || 0,
      phone: shop.phone || null,
      website: shop.website || null,
      hours: shop.hours || null,
      photos: shop.photos || null
    });
  });

  // Combined dataset
  var allShops = COMPETITORS.map(function(c) {
    var copy = {};
    for (var k in c) copy[k] = c[k];
    copy.source = 'db';
    copy.pricing_source = 'verified';
    return copy;
  }).concat(googleCompetitors);

  var totalShops = allShops.length;

  // ─── Update KPIs ───────────────────────────────────────────
  // Shops tracked
  var kpiShops = document.getElementById('kpi-shops');
  var kpiShopsSub = document.getElementById('kpi-shops-sub');
  if (kpiShops) kpiShops.textContent = totalShops;
  if (kpiShopsSub) kpiShopsSub.textContent = COMPETITORS.length + ' DB + ' + googleCompetitors.length + ' Google';

  // Avg haircut — weighted blending: DB=1.0, BOOKING=0.9, ESTIMATED=0.7
  var haircutPrices = [];
  var haircutWeighted = 0;
  var haircutWeightSum = 0;
  allShops.forEach(function(s) {
    var price = typeof s.avgCut === 'number' && s.avgCut > 0 ? s.avgCut : null;
    if (!price) return;
    haircutPrices.push(price);
    var weight = 1.0;
    if (s.pricing_source === 'booking') weight = 0.9;
    else if (s.pricing_source === 'estimated') weight = 0.7;
    else if (s.source === 'db') weight = 1.0;
    haircutWeighted += price * weight;
    haircutWeightSum += weight;
  });
  if (haircutPrices.length > 0) {
    var avgHaircut = haircutWeightSum > 0 ? Math.round(haircutWeighted / haircutWeightSum) : 37;
    var minH = Math.min.apply(null, haircutPrices);
    var maxH = Math.max.apply(null, haircutPrices);
    var kpiHaircut = document.getElementById('kpi-haircut');
    var kpiHaircutSub = document.getElementById('kpi-haircut-sub');
    if (kpiHaircut) kpiHaircut.textContent = '$' + avgHaircut;
    if (kpiHaircutSub) kpiHaircutSub.textContent = 'Range: $' + minH + ' \u2013 $' + maxH + ' (' + haircutPrices.length + ' shops)';
  }

  // Barbers profiled — count from allShops (DB barbers + Google barber_count already merged)
  var totalBarbers = 0;
  allShops.forEach(function(s) {
    if (typeof s.barbers === 'number' && s.barbers > 0) totalBarbers += s.barbers;
  });
  var kpiBarbers = document.getElementById('kpi-barbers');
  var kpiBarbSub = document.getElementById('kpi-barbers-sub');
  if (kpiBarbers && totalBarbers > 0) kpiBarbers.textContent = totalBarbers;
  if (kpiBarbSub) kpiBarbSub.textContent = 'Active in CLT market';

  // Avg beard trim — weighted blending: DB=1.0, BOOKING=0.9, ESTIMATED=0.7
  var beardPrices = [];
  var beardWeighted = 0;
  var beardWeightSum = 0;
  googleShops.forEach(function(s) {
    if (s.estimated_beard && s.estimated_beard > 0) {
      beardPrices.push(s.estimated_beard);
      var bw = 1.0;
      if (s.pricing_source === 'booking') bw = 0.9;
      else if (s.pricing_source === 'estimated') bw = 0.7;
      beardWeighted += s.estimated_beard * bw;
      beardWeightSum += bw;
    }
  });
  // Include DB beard prices from PRICING_BY_ZIP (weight 1.0)
  PRICING_BY_ZIP.forEach(function(z) {
    if (typeof z.beard === 'number') {
      beardPrices.push(z.beard);
      beardWeighted += z.beard * 1.0;
      beardWeightSum += 1.0;
    }
  });
  if (beardPrices.length > 0) {
    var avgBeard = beardWeightSum > 0 ? Math.round(beardWeighted / beardWeightSum) : 20;
    var minB = Math.min.apply(null, beardPrices);
    var maxB = Math.max.apply(null, beardPrices);
    var kpiBeard = document.getElementById('kpi-beard');
    var kpiBeardSub = document.getElementById('kpi-beard-sub');
    if (kpiBeard) kpiBeard.textContent = '$' + avgBeard;
    if (kpiBeardSub) kpiBeardSub.textContent = 'Range: $' + minB + ' \u2013 $' + maxB + ' (' + beardPrices.length + ' shops)';
  }

  // Avg rating across all shops
  var ratingValues = [];
  allShops.forEach(function(s) {
    if (typeof s.rating === 'number' && s.rating > 0) ratingValues.push(s.rating);
  });
  if (ratingValues.length > 0) {
    var avgRating = (ratingValues.reduce(function(a, b) { return a + b; }, 0) / ratingValues.length).toFixed(1);
    var kpiRating = document.getElementById('kpi-rating');
    var kpiRatingSub = document.getElementById('kpi-rating-sub');
    if (kpiRating) kpiRating.textContent = avgRating;
    if (kpiRatingSub) kpiRatingSub.textContent = 'Across ' + ratingValues.length + ' rated shops';
  }

  // ─── Update Heat Map (zip code counts + pricing) ──────────
  // Build enriched PRICING_BY_ZIP with Google data
  var zipShopCounts = {};
  var zipHaircutPrices = {};
  var zipBeardPrices = {};
  var zipStudentsPrices = {};
  var zipHotTowelPrices = {};
  var zipLineupPrices = {};

  // Start with DB data
  PRICING_BY_ZIP.forEach(function(z) {
    zipShopCounts[z.zip] = z.shops || 0;
    if (typeof z.haircut === 'number') zipHaircutPrices[z.zip] = [z.haircut];
    if (typeof z.beard === 'number') zipBeardPrices[z.zip] = [z.beard];
    if (typeof z.students === 'number') zipStudentsPrices[z.zip] = [z.students];
    if (typeof z.hotTowel === 'number') zipHotTowelPrices[z.zip] = [z.hotTowel];
    if (typeof z.lineup === 'number') zipLineupPrices[z.zip] = [z.lineup];
  });

  // Add Google shop data by derived_zip
  googleShops.forEach(function(s) {
    var zip = s.derived_zip;
    if (!zip) return;
    zipShopCounts[zip] = (zipShopCounts[zip] || 0) + 1;
    if (s.estimated_haircut) {
      if (!zipHaircutPrices[zip]) zipHaircutPrices[zip] = [];
      zipHaircutPrices[zip].push(s.estimated_haircut);
    }
    if (s.estimated_beard) {
      if (!zipBeardPrices[zip]) zipBeardPrices[zip] = [];
      zipBeardPrices[zip].push(s.estimated_beard);
    }
    if (s.estimated_students) {
      if (!zipStudentsPrices[zip]) zipStudentsPrices[zip] = [];
      zipStudentsPrices[zip].push(s.estimated_students);
    }
    if (s.estimated_hotTowel) {
      if (!zipHotTowelPrices[zip]) zipHotTowelPrices[zip] = [];
      zipHotTowelPrices[zip].push(s.estimated_hotTowel);
    }
    if (s.estimated_lineup) {
      if (!zipLineupPrices[zip]) zipLineupPrices[zip] = [];
      zipLineupPrices[zip].push(s.estimated_lineup);
    }
  });

  // Helper to fill missing price from Google estimates
  function fillPrice(z, field, priceMap) {
    if ((z[field] === '\u2014' || z[field] === undefined) && priceMap[z.zip] && priceMap[z.zip].length) {
      var arr = priceMap[z.zip];
      z[field] = Math.round(arr.reduce(function(a, b) { return a + b; }, 0) / arr.length);
      z._estimated = true;
    }
  }

  // Update PRICING_BY_ZIP shop counts and fill in ALL missing prices
  PRICING_BY_ZIP.forEach(function(z) {
    if (zipShopCounts[z.zip]) z.shops = zipShopCounts[z.zip];
    fillPrice(z, 'haircut', zipHaircutPrices);
    fillPrice(z, 'beard', zipBeardPrices);
    fillPrice(z, 'students', zipStudentsPrices);
    fillPrice(z, 'hotTowel', zipHotTowelPrices);
    fillPrice(z, 'lineup', zipLineupPrices);
  });

  // Add new zip codes that aren't in PRICING_BY_ZIP yet
  var existingZips = {};
  PRICING_BY_ZIP.forEach(function(z) { existingZips[z.zip] = true; });

  var ZIP_NAMES = {
    '28204': 'Plaza Midwood / Elizabeth', '28207': 'Myers Park / Eastover',
    '28210': 'South Charlotte / Quail Hollow', '28212': 'East Charlotte / Idlewild',
    '28214': 'West Charlotte / Moores Chapel', '28217': 'Steele Creek',
    '28226': 'Ballantyne', '28227': 'Mint Hill', '28270': 'Providence / Weddington',
    '28277': 'Ballantyne / Ardrey Kell', '28278': 'Lake Wylie / Berewick'
  };
  Object.keys(zipShopCounts).forEach(function(zip) {
    if (!existingZips[zip] && zipShopCounts[zip] > 0) {
      var avgFn = function(arr) {
        return arr && arr.length ? Math.round(arr.reduce(function(a, b) { return a + b; }, 0) / arr.length) : '\u2014';
      };
      PRICING_BY_ZIP.push({
        zip: zip,
        area: ZIP_NAMES[zip] || 'Charlotte ' + zip,
        haircut: avgFn(zipHaircutPrices[zip]),
        beard: avgFn(zipBeardPrices[zip]),
        students: avgFn(zipStudentsPrices[zip]),
        hotTowel: avgFn(zipHotTowelPrices[zip]),
        lineup: avgFn(zipLineupPrices[zip]),
        shops: zipShopCounts[zip],
        _estimated: true
      });
    }
  });

  // Store combined allShops on window so gap finder and other sections can access it
  window._reupAllShops = allShops;

  // Re-render heat map, pricing table, density, and competitor table
  renderHeatMap('haircut');
  renderPricingTable();
  renderCompetitorTableCombined(allShops);
  renderDensityCombined();

  // Re-render gap finder with updated data
  renderGapFinder();
}

// Render competitor table with combined DB + Google data
function renderCompetitorTableCombined(allShops) {
  var tbody = document.getElementById('competitor-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  allShops.forEach(function(c) {
    var tr = document.createElement('tr');
    var ratingStr = (c.rating === '\u2014' || c.rating === undefined || c.rating === null) ? '\u2014' : Number(c.rating).toFixed(1);
    var priceStr = formatPrice(c.avgCut);
    var sourceBadge = '';
    if (c.source === 'google') {
      if (c.pricing_source === 'booking') {
        sourceBadge = ' <span class="source-badge source-badge--booking">BOOKING</span>';
      } else if (c.pricing_source === 'estimated') {
        sourceBadge = ' <span class="source-badge source-badge--estimated">EST</span>';
      } else {
        sourceBadge = ' <span class="source-badge source-badge--live">GOOGLE</span>';
      }
    } else {
      sourceBadge = ' <span class="source-badge source-badge--static">DB</span>';
    }

    // Show review count as competitive signal for Google shops
    var ratingCol = ratingStr;
    if (c.source === 'google' && c.total_ratings > 0) {
      ratingCol += ' <span class="rating-count">(' + c.total_ratings + ')</span>';
    }

    tr.innerHTML =
      '<td data-label="Shop Name">' + escapeHtml(c.name) + sourceBadge + '</td>' +
      '<td data-label="Neighborhood">' + escapeHtml(c.neighborhood || c.zip || '') + '</td>' +
      '<td class="cell-mono" data-label="Zip">' + escapeHtml(c.zip || '') + '</td>' +
      '<td class="cell-price" data-label="Avg Cut">' + priceStr +
        (c.pricing_source === 'estimated' ? ' <span class="price-est">~</span>' : '') +
        (c.pricing_source === 'booking' ? ' <span class="price-verified">\u2713</span>' : '') + '</td>' +
      '<td data-label="Rating">' + ratingCol + '</td>' +
      '<td data-label="Barbers">' + escapeHtml(c.barbers) + '</td>' +
      '<td data-label="Model">' + escapeHtml(c.model === '\u2014' && c.source === 'google' ? 'Unknown' : (c.model || '\u2014')) + '</td>';
    tbody.appendChild(tr);
  });
}

// Re-render density with combined data
function renderDensityCombined() {
  var grid = document.getElementById('density-grid');
  if (!grid) return;
  grid.innerHTML = '';

  var densityData = PRICING_BY_ZIP.map(function(row) {
    return { zip: row.zip, area: row.area, count: row.shops || 0 };
  });
  densityData.sort(function(a, b) { return b.count - a.count; });

  var maxCount = Math.max.apply(null, densityData.map(function(d) { return d.count; }));
  if (maxCount === 0) maxCount = 1;

  densityData.forEach(function(d) {
    var pct = Math.round((d.count / maxCount) * 100);
    var card = document.createElement('div');
    card.className = 'density-card';
    card.innerHTML =
      '<div class="density-header">' +
        '<span class="density-zip cell-mono">' + escapeHtml(d.zip) + '</span>' +
        '<span class="density-count">' + escapeHtml(d.count) + ' shops</span>' +
      '</div>' +
      '<span class="density-area">' + escapeHtml(d.area) + '</span>' +
      '<div class="density-bar-track">' +
        '<div class="density-bar-fill" style="width:' + pct + '%"></div>' +
      '</div>';
    grid.appendChild(card);
  });
}

// --------------- INIT ---------------

document.addEventListener("DOMContentLoaded", function () {
  // Verify auth server-side, then render accordingly
  window.RE_UP_AUTH.isAuthenticated().then(function (authed) {
    // Always set up admin login (works on both gated and unlocked states)
    setupAdminLogin(authed);

    // Check access
    if (!authed) {
      applyDashPaywall();
      return;  // Don't render the gated data
    }

    // Render all sections
    removeSkeleton('kpi-cards');
    renderHeatMap('haircut');
    setupHeatMapButtons();
    renderPricingTable();
    removeSkeleton('pricing-table');
    renderCompetitorTable();
    removeSkeleton('competitor-table');
    renderSocialTable();
    removeSkeleton('social-table');
    renderMoves();
    renderDensity();
    removeSkeleton('news-cards');
    removeSkeleton('ticker');

    // Render interactive tools
    renderPriceCompare();
    renderRevenueEstimator();
    renderGapFinder();

    // Set up interactivity
    setupFilterButtons();
    setupCompetitorSearch();
    makeSortable("pricing-table", PRICING_BY_ZIP, renderPricingTableFromData);
    makeSortable("competitor-table", COMPETITORS, renderCompetitorTable);

    // Initialize map + live data refresh
    if (window.RE_UP_MAP) {
      window.RE_UP_MAP.init();
    }

    // Listen for enriched Google Places data to re-render all sections
    window.addEventListener('reup:google-data', handleGoogleDataLoaded);

    // Show replay tour link for logged-in users
    var replayLink = document.getElementById('replayTourLink');
    if (replayLink) {
      replayLink.style.display = 'inline';
      replayLink.addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('reup_tour_done');
        startGuidedTour();
      });
    }

    // Launch guided tour for first-time subscribers
    setTimeout(function () { startGuidedTour(); }, 600);
  });
});
