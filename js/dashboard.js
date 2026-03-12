/* ============================================================
   RE UP Report — Charlotte Market Dashboard
   js/dashboard.js
   ============================================================ */

// --------------- SEED DATA ---------------

// All pricing verified via Booksy, Squire, Fresha, shop websites, Yelp, Axios Charlotte
// "—" = not found in any public source. No fabricated data.
const PRICING_BY_ZIP = [
  { zip: "28202", area: "Uptown / Center City", haircut: 35, fade: "—", beard: "—", kids: 26, hotTowel: "—", lineup: "—", shops: 5 },
  { zip: "28203", area: "South End / Dilworth", haircut: 44, fade: 65, beard: 25, kids: "—", hotTowel: 40, lineup: 20, shops: 6 },
  { zip: "28205", area: "NoDa / Plaza Midwood", haircut: 38, fade: 60, beard: 23, kids: 31, hotTowel: "—", lineup: "—", shops: 5 },
  { zip: "28206", area: "North Charlotte / Druid Hills", haircut: 20, fade: "—", beard: "—", kids: "—", hotTowel: "—", lineup: "—", shops: 2 },
  { zip: "28208", area: "West Charlotte / Airport", haircut: "—", fade: "—", beard: "—", kids: "—", hotTowel: "—", lineup: "—", shops: 3 },
  { zip: "28209", area: "Park Road / Selwyn", haircut: 27, fade: "—", beard: 12, kids: "—", hotTowel: "—", lineup: "—", shops: 4 },
  { zip: "28210", area: "South Charlotte / Sharon Lakes", haircut: "—", fade: "—", beard: "—", kids: "—", hotTowel: "—", lineup: "—", shops: 1 },
  { zip: "28211", area: "SouthPark / Myers Park", haircut: "—", fade: "—", beard: "—", kids: "—", hotTowel: "—", lineup: "—", shops: 2 },
  { zip: "28213", area: "University City / UNCC", haircut: 35, fade: 42, beard: 25, kids: "—", hotTowel: "—", lineup: "—", shops: 8 },
  { zip: "28215", area: "East Charlotte / Albemarle Rd", haircut: 25, fade: 50, beard: "—", kids: "—", hotTowel: "—", lineup: "—", shops: 2 },
  { zip: "28216", area: "Brookshire / North Charlotte", haircut: 33, fade: "—", beard: "—", kids: 20, hotTowel: "—", lineup: "—", shops: 3 },
  { zip: "28262", area: "University City / N Tryon", haircut: "—", fade: "—", beard: "—", kids: "—", hotTowel: "—", lineup: "—", shops: 2 },
  { zip: "28269", area: "University City / WT Harris", haircut: "—", fade: "—", beard: "—", kids: "—", hotTowel: "—", lineup: "—", shops: 2 },
  { zip: "28273", area: "Steele Creek", haircut: 35, fade: "—", beard: "—", kids: "—", hotTowel: "—", lineup: "—", shops: 2 }
];

// All shops verified via Google, Yelp, Booksy, Squire, Fresha, Vagaro, shop websites
// avgCut derived from pricing.json where available; "—" = no public price found
const COMPETITORS = [
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
  var modal = document.getElementById('adminModal');
  var closeBtn = document.getElementById('adminModalClose');
  var submitBtn = document.getElementById('adminSubmitBtn');
  var passwordInput = document.getElementById('adminPasswordInput');
  var errorMsg = document.getElementById('adminError');

  if (isLoggedIn) {
    if (loginLink) loginLink.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'inline';
  }

  if (loginLink) {
    loginLink.addEventListener('click', function (e) {
      e.preventDefault();
      if (modal) modal.style.display = 'flex';
      if (passwordInput) passwordInput.focus();
    });
  }

  if (logoutLink) {
    logoutLink.addEventListener('click', function (e) {
      e.preventDefault();
      window.RE_UP_AUTH.logout().then(function () {
        location.reload();
      });
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', function () { modal.style.display = 'none'; });
  }

  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) modal.style.display = 'none';
    });
  }

  if (submitBtn && passwordInput) {
    submitBtn.addEventListener('click', function () {
      var pw = passwordInput.value;
      if (!pw) return;
      submitBtn.disabled = true;
      window.RE_UP_AUTH.login(pw).then(function (data) {
        if (data.success) {
          location.reload();
        } else {
          if (errorMsg) errorMsg.style.display = 'block';
          passwordInput.value = '';
          submitBtn.disabled = false;
        }
      }).catch(function () {
        if (errorMsg) errorMsg.style.display = 'block';
        passwordInput.value = '';
        submitBtn.disabled = false;
      });
    });

    passwordInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') submitBtn.click();
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
        '<p class="dash-paywall-card-desc">47 shops profiled with pricing, ratings, barber count, and business model. Search by name, neighborhood, or zip to find your direct competition.</p>' +
        '<span class="dash-paywall-card-tag">47 shops</span>' +
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
        '<div class="paywall-plan-name">Intel Monthly</div>' +
        '<div class="paywall-plan-price"><span class="paywall-currency">$</span>9<span class="paywall-period">/mo</span></div>' +
        '<ul class="paywall-plan-includes">' +
          '<li>Full market dashboard</li>' +
          '<li>All articles & outlook briefs</li>' +
          '<li>Weekly email intel digest</li>' +
        '</ul>' +
        '<button class="btn btn-primary paywall-cta" data-plan="monthly">Start 7-Day Free Trial</button>' +
      '</div>' +
      '<div class="paywall-plan paywall-plan--featured">' +
        '<div class="paywall-plan-badge">Best Value</div>' +
        '<div class="paywall-plan-name">Intel Annual</div>' +
        '<div class="paywall-plan-price"><span class="paywall-currency">$</span>79<span class="paywall-period">/yr</span></div>' +
        '<div class="paywall-plan-savings">Save $29 vs monthly</div>' +
        '<ul class="paywall-plan-includes">' +
          '<li>Everything in Monthly</li>' +
          '<li>Quarterly market reports</li>' +
          '<li>Priority access to new tools</li>' +
        '</ul>' +
        '<button class="btn btn-primary paywall-cta" data-plan="annual">Start 7-Day Free Trial</button>' +
      '</div>' +
    '</div>' +

    '<p class="paywall-note">Cancel anytime. No charge during trial. Built by barbers, for barbers.</p>' +
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
      '<td class="cell-mono">' + escapeHtml(row.zip) + "</td>" +
      "<td>" + escapeHtml(row.area) + "</td>" +
      '<td class="cell-price" data-service="haircut">' + escapeHtml(formatPrice(row.haircut)) + "</td>" +
      '<td class="cell-price" data-service="fade">' + escapeHtml(formatPrice(row.fade)) + "</td>" +
      '<td class="cell-price" data-service="beard">' + escapeHtml(formatPrice(row.beard)) + "</td>" +
      '<td class="cell-price" data-service="kids">' + escapeHtml(formatPrice(row.kids)) + "</td>" +
      '<td class="cell-price" data-service="hotTowel">' + escapeHtml(formatPrice(row.hotTowel)) + "</td>" +
      '<td class="cell-price" data-service="lineup">' + escapeHtml(formatPrice(row.lineup)) + "</td>" +
      '<td class="cell-count">' + escapeHtml(row.shops) + "</td>";
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
      "<td>" + escapeHtml(c.name) + "</td>" +
      "<td>" + escapeHtml(c.neighborhood) + "</td>" +
      '<td class="cell-mono">' + escapeHtml(c.zip) + "</td>" +
      '<td class="cell-price">' + escapeHtml(formatPrice(c.avgCut)) + "</td>" +
      "<td>" + escapeHtml(c.rating === "—" ? "—" : c.rating.toFixed(1)) + "</td>" +
      "<td>" + escapeHtml(c.barbers) + "</td>" +
      "<td>" + escapeHtml(c.model) + "</td>";
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
      "<td>" + escapeHtml(s.rank) + "</td>" +
      "<td>" + escapeHtml(s.name) + "</td>" +
      "<td>" + escapeHtml(s.type) + "</td>" +
      "<td>" + escapeHtml(s.platform) + "</td>" +
      "<td>" + escapeHtml(formatFollowers(s.followers)) + "</td>" +
      "<td>" + escapeHtml(s.engagement) + "</td>";
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
  var serviceToColIndex = { haircut: 2, fade: 3, beard: 4, kids: 5, hotTowel: 6, lineup: 7 };
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
      '<td class="cell-mono">' + escapeHtml(row.zip) + "</td>" +
      "<td>" + escapeHtml(row.area) + "</td>" +
      '<td class="cell-price" data-service="haircut">' + escapeHtml(formatPrice(row.haircut)) + "</td>" +
      '<td class="cell-price" data-service="fade">' + escapeHtml(formatPrice(row.fade)) + "</td>" +
      '<td class="cell-price" data-service="beard">' + escapeHtml(formatPrice(row.beard)) + "</td>" +
      '<td class="cell-price" data-service="kids">' + escapeHtml(formatPrice(row.kids)) + "</td>" +
      '<td class="cell-price" data-service="hotTowel">' + escapeHtml(formatPrice(row.hotTowel)) + "</td>" +
      '<td class="cell-price" data-service="lineup">' + escapeHtml(formatPrice(row.lineup)) + "</td>" +
      '<td class="cell-count">' + escapeHtml(row.shops) + "</td>";
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

function renderHeatMap(service) {
  service = service || 'haircut';
  var grid = document.getElementById('heatmap-grid');
  if (!grid) return;

  var MIN_PRICE = 20;
  var MAX_PRICE = 65;
  var LOW_R = 60, LOW_G = 5, LOW_B = 5;
  var HIGH_R = 229, HIGH_G = 9, HIGH_B = 20;

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

  function interpolateColor(price) {
    var t = (price - MIN_PRICE) / (MAX_PRICE - MIN_PRICE);
    t = Math.max(0, Math.min(1, t));
    return {
      r: Math.round(LOW_R + (HIGH_R - LOW_R) * t),
      g: Math.round(LOW_G + (HIGH_G - LOW_G) * t),
      b: Math.round(LOW_B + (HIGH_B - LOW_B) * t)
    };
  }

  function createTile(entry, price, hasData) {
    var tile = document.createElement('div');
    tile.className = 'heatmap-tile';

    if (hasData) {
      var color = interpolateColor(price);
      var intensity = Math.max(0, Math.min(1, (price - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)));
      tile.style.backgroundColor = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
      tile.style.boxShadow = '0 0 ' + Math.round(8 + intensity * 16) + 'px rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + (0.3 + intensity * 0.4).toFixed(2) + ')';
      tile.style.border = '1px solid rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + (0.4 + intensity * 0.4).toFixed(2) + ')';
      if (intensity > 0.5) tile.classList.add('heatmap-tile--hot');

      tile.innerHTML =
        '<div class="heatmap-zip">' + escapeHtml(entry.zip) + '</div>' +
        '<div class="heatmap-area">' + escapeHtml(entry.area) + '</div>' +
        '<div class="heatmap-price">$' + escapeHtml(price) + '</div>' +
        '<div class="heatmap-shops">' + escapeHtml(entry.shops) + ' shop' + (entry.shops !== 1 ? 's' : '') + '</div>';
    } else {
      tile.style.backgroundColor = 'rgba(255,255,255,0.03)';
      tile.style.border = '1px solid rgba(255,255,255,0.06)';

      tile.innerHTML =
        '<div class="heatmap-zip">' + escapeHtml(entry.zip) + '</div>' +
        '<div class="heatmap-area">' + escapeHtml(entry.area) + '</div>' +
        '<span class="heatmap-nodata">NO DATA</span>' +
        '<div class="heatmap-shops">' + escapeHtml(entry.shops) + ' shop' + (entry.shops !== 1 ? 's' : '') + '</div>';
    }

    return tile;
  }

  withPrice.forEach(function (item) {
    grid.appendChild(createTile(item.entry, item.price, true));
  });
  noData.forEach(function (entry) {
    grid.appendChild(createTile(entry, null, false));
  });
}

function setupHeatMapButtons() {
  var buttons = document.querySelectorAll('.heatmap-filter-btn');
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
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

  var maxComps = 0;
  PRICING_BY_ZIP.forEach(function (e) {
    var c = COMPETITORS.filter(function (comp) { return comp.zip === e.zip; }).length;
    if (c > maxComps) maxComps = c;
  });
  if (maxComps === 0) maxComps = 1;

  var scored = PRICING_BY_ZIP.map(function (entry) {
    var shopCount = entry.shops || 0;
    var avgPrice = typeof entry.haircut === 'number' ? entry.haircut : 0;
    var competitorCount = COMPETITORS.filter(function (c) { return c.zip === entry.zip; }).length;

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
    body: 'This is your bird\'s-eye view of Charlotte pricing. The redder the tile, the more expensive that zip code is. Dark tiles = cheaper areas. Tap the buttons up top to switch between Men\'s Cut, Fade, Beard, and Kids.',
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
    body: 'Every barbershop we track in Charlotte — 47 shops with their pricing, ratings, barber count, and business model. Use the search bar to find any shop by name, neighborhood, or zip code.',
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

  // Attach CTA handlers
  var buttons = document.querySelectorAll('.paywall-cta');
  for (var b = 0; b < buttons.length; b++) {
    buttons[b].addEventListener('click', function () {
      var plan = this.getAttribute('data-plan');
      var email = prompt('Enter your email to start your free trial (' + plan + ' plan):');
      if (email && email.indexOf('@') > 0) {
        alert('Thanks! We\u2019ll send your trial access to ' + email + '. Check your inbox.');
      }
    });
  }
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
    renderHeatMap('haircut');
    setupHeatMapButtons();
    renderPricingTable();
    renderCompetitorTable();
    renderSocialTable();
    renderMoves();
    renderDensity();

    // Render interactive tools
    renderPriceCompare();
    renderRevenueEstimator();
    renderGapFinder();

    // Set up interactivity
    setupFilterButtons();
    setupCompetitorSearch();
    makeSortable("pricing-table", PRICING_BY_ZIP, renderPricingTableFromData);
    makeSortable("competitor-table", COMPETITORS, renderCompetitorTable);

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
