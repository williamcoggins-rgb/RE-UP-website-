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
  { zip: "28213", area: "University City / UNCC", haircut: "—", fade: "—", beard: "—", kids: "—", hotTowel: "—", lineup: "—", shops: 1 },
  { zip: "28215", area: "East Charlotte / Albemarle Rd", haircut: 25, fade: 50, beard: "—", kids: "—", hotTowel: "—", lineup: "—", shops: 2 },
  { zip: "28216", area: "Brookshire / North Charlotte", haircut: 33, fade: "—", beard: "—", kids: 20, hotTowel: "—", lineup: "—", shops: 3 },
  { zip: "28262", area: "University City / N Tryon", haircut: "—", fade: "—", beard: "—", kids: "—", hotTowel: "—", lineup: "—", shops: 1 },
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
  // 28215 — East Charlotte / Albemarle Rd
  { name: "Edward's Boyz Barber Shop", neighborhood: "East Charlotte", zip: "28215", avgCut: "—", rating: 4.8, barbers: "—", model: "Hybrid", tier: "Mid-tier" },
  { name: "Right Touch Barbershop", neighborhood: "East Charlotte", zip: "28215", avgCut: 25, rating: 5.0, barbers: "—", model: "Hybrid", tier: "Mid-tier" },
  // 28216 — Brookshire / North Charlotte
  { name: "M&M Barber Studio", neighborhood: "Brookshire", zip: "28216", avgCut: "—", rating: "—", barbers: "—", model: "Appointment", tier: "Mid-tier" },
  { name: "Tha Kut Club Barbershop Lounge", neighborhood: "Brookshire", zip: "28216", avgCut: 25, rating: 5.0, barbers: "—", model: "Appointment", tier: "Value" },
  { name: "No Grease Mosaic", neighborhood: "Brookshire", zip: "28216", avgCut: 30, rating: 4.2, barbers: "—", model: "Hybrid", tier: "Mid-tier" },
  // 28262 — University City / N Tryon
  { name: "Emperial Barber Lounge", neighborhood: "University City", zip: "28262", avgCut: "—", rating: 4.9, barbers: "—", model: "Appointment", tier: "Mid-tier" },
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
      '<td class="cell-mono">' + row.zip + "</td>" +
      "<td>" + row.area + "</td>" +
      '<td class="cell-price" data-service="haircut">' + formatPrice(row.haircut) + "</td>" +
      '<td class="cell-price" data-service="fade">' + formatPrice(row.fade) + "</td>" +
      '<td class="cell-price" data-service="beard">' + formatPrice(row.beard) + "</td>" +
      '<td class="cell-price" data-service="kids">' + formatPrice(row.kids) + "</td>" +
      '<td class="cell-price" data-service="hotTowel">' + formatPrice(row.hotTowel) + "</td>" +
      '<td class="cell-price" data-service="lineup">' + formatPrice(row.lineup) + "</td>" +
      '<td class="cell-count">' + row.shops + "</td>";
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
      "<td>" + c.name + "</td>" +
      "<td>" + c.neighborhood + "</td>" +
      '<td class="cell-mono">' + c.zip + "</td>" +
      '<td class="cell-price">' + formatPrice(c.avgCut) + "</td>" +
      "<td>" + (c.rating === "—" ? "—" : c.rating.toFixed(1)) + "</td>" +
      "<td>" + c.barbers + "</td>" +
      "<td>" + c.model + "</td>";
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
      "<td>" + s.rank + "</td>" +
      "<td>" + s.name + "</td>" +
      "<td>" + s.type + "</td>" +
      "<td>" + s.platform + "</td>" +
      "<td>" + formatFollowers(s.followers) + "</td>" +
      "<td>" + s.engagement + "</td>";
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
        '<span class="move-type">' + m.type + "</span>" +
        '<span class="move-impact move-impact--' + m.impact.toLowerCase() + '">' + m.impact + " Impact</span>" +
      "</div>" +
      '<h3 class="move-title">' + m.title + "</h3>" +
      '<p class="move-detail">' + m.detail + "</p>" +
      '<span class="move-date">' + m.date + "</span>";

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
        '<span class="density-zip cell-mono">' + d.zip + "</span>" +
        '<span class="density-count">' + d.count + " shops</span>" +
      "</div>" +
      '<span class="density-area">' + d.area + "</span>" +
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
      '<td class="cell-mono">' + row.zip + "</td>" +
      "<td>" + row.area + "</td>" +
      '<td class="cell-price" data-service="haircut">' + formatPrice(row.haircut) + "</td>" +
      '<td class="cell-price" data-service="fade">' + formatPrice(row.fade) + "</td>" +
      '<td class="cell-price" data-service="beard">' + formatPrice(row.beard) + "</td>" +
      '<td class="cell-price" data-service="kids">' + formatPrice(row.kids) + "</td>" +
      '<td class="cell-price" data-service="hotTowel">' + formatPrice(row.hotTowel) + "</td>" +
      '<td class="cell-price" data-service="lineup">' + formatPrice(row.lineup) + "</td>" +
      '<td class="cell-count">' + row.shops + "</td>";
    tbody.appendChild(tr);
  });

  // Re-apply any active service highlight
  var activeBtn = document.querySelector(".dash-filter-btn.active");
  if (activeBtn) {
    var service = activeBtn.getAttribute("data-service");
    if (service !== "all") highlightServiceColumn(service);
  }
}

// --------------- INIT ---------------

document.addEventListener("DOMContentLoaded", function () {
  // Render all sections
  renderPricingTable();
  renderCompetitorTable();
  renderSocialTable();
  renderMoves();
  renderDensity();

  // Set up interactivity
  setupFilterButtons();
  setupCompetitorSearch();
  makeSortable("pricing-table", PRICING_BY_ZIP, renderPricingTableFromData);
  makeSortable("competitor-table", COMPETITORS, renderCompetitorTable);
});
