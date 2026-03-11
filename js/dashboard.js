/* ============================================================
   RE UP Report — Charlotte Market Dashboard
   js/dashboard.js
   ============================================================ */

// --------------- SEED DATA ---------------

const PRICING_BY_ZIP = [
  { zip: "28202", area: "Uptown / Center City", haircut: 38, fade: 42, beard: 20, kids: "—", hotTowel: 40, lineup: "—", shops: 5 },
  { zip: "28203", area: "South End / Dilworth", haircut: 35, fade: 40, beard: 18, kids: "—", hotTowel: 35, lineup: "—", shops: 4 },
  { zip: "28204", area: "Plaza Midwood / Elizabeth", haircut: 32, fade: 37, beard: 16, kids: 20, hotTowel: "—", lineup: 15, shops: 3 },
  { zip: "28205", area: "NoDa / Villa Heights", haircut: 30, fade: 35, beard: 15, kids: "—", hotTowel: "—", lineup: "—", shops: 4 },
  { zip: "28206", area: "North Charlotte / Druid Hills", haircut: 25, fade: 30, beard: 12, kids: "—", hotTowel: "—", lineup: 12, shops: 3 },
  { zip: "28208", area: "West Charlotte / Airport", haircut: 25, fade: 28, beard: 12, kids: "—", hotTowel: "—", lineup: "—", shops: 3 },
  { zip: "28210", area: "South Charlotte / Quail Hollow", haircut: 30, fade: 35, beard: 15, kids: 18, hotTowel: 30, lineup: "—", shops: 4 },
  { zip: "28211", area: "SouthPark / Myers Park", haircut: 40, fade: 45, beard: 22, kids: "—", hotTowel: "—", lineup: "—", shops: 3 },
  { zip: "28215", area: "East Charlotte / Albemarle Rd", haircut: 22, fade: 27, beard: 10, kids: "—", hotTowel: "—", lineup: "—", shops: 3 },
  { zip: "28216", area: "North Charlotte / Brookshire", haircut: 25, fade: 30, beard: 12, kids: "—", hotTowel: "—", lineup: "—", shops: 3 },
  { zip: "28217", area: "Steele Creek / Westinghouse", haircut: 28, fade: 32, beard: 14, kids: "—", hotTowel: "—", lineup: "—", shops: 3 },
  { zip: "28269", area: "University City / Concord Mills", haircut: 27, fade: 32, beard: 13, kids: 15, hotTowel: "—", lineup: "—", shops: 2 }
];

const COMPETITORS = [
  { name: "Crown & Blade Barbershop", neighborhood: "South End", zip: "28203", avgCut: 40, rating: 4.9, barbers: 4, model: "Appointment", tier: "Premium" },
  { name: "The Parlour CLT", neighborhood: "NoDa", zip: "28205", avgCut: 35, rating: 4.9, barbers: 3, model: "Hybrid", tier: "Mid-tier" },
  { name: "Uptown Cuts", neighborhood: "Uptown", zip: "28202", avgCut: 42, rating: 4.8, barbers: 5, model: "Appointment", tier: "Premium" },
  { name: "Queen City Cutz", neighborhood: "SouthPark", zip: "28211", avgCut: 45, rating: 4.8, barbers: 3, model: "Appointment", tier: "Premium" },
  { name: "704 Barbershop", neighborhood: "Plaza Midwood", zip: "28204", avgCut: 30, rating: 4.7, barbers: 4, model: "Hybrid", tier: "Mid-tier" },
  { name: "Fresh Fades CLT", neighborhood: "Druid Hills", zip: "28206", avgCut: 25, rating: 4.6, barbers: 2, model: "Walk-in", tier: "Value" },
  { name: "The Cut Lab", neighborhood: "Uptown", zip: "28202", avgCut: 40, rating: 4.7, barbers: 3, model: "Appointment", tier: "Premium" },
  { name: "Legacy Barber Lounge", neighborhood: "Quail Hollow", zip: "28210", avgCut: 28, rating: 4.5, barbers: 2, model: "Hybrid", tier: "Mid-tier" },
  { name: "Sport Clips - Steele Creek", neighborhood: "Steele Creek", zip: "28217", avgCut: 25, rating: 4.1, barbers: 3, model: "Walk-in", tier: "Value" },
  { name: "Great Clips - University", neighborhood: "University City", zip: "28269", avgCut: 22, rating: 3.9, barbers: 2, model: "Walk-in", tier: "Value" },
  { name: "Majesty Barbershop", neighborhood: "Brookshire", zip: "28216", avgCut: 25, rating: 4.5, barbers: 2, model: "Walk-in", tier: "Value" },
  { name: "Razor Sharp Studios", neighborhood: "West Charlotte", zip: "28208", avgCut: 25, rating: 4.6, barbers: 1, model: "Hybrid", tier: "Value" },
  { name: "Gentlemen's Quarter", neighborhood: "Dilworth", zip: "28203", avgCut: 38, rating: 4.7, barbers: 3, model: "Appointment", tier: "Premium" },
  { name: "CLT Clippers", neighborhood: "Albemarle Rd", zip: "28215", avgCut: 20, rating: 4.3, barbers: 2, model: "Walk-in", tier: "Value" },
  { name: "Next Level Barbershop", neighborhood: "Villa Heights", zip: "28205", avgCut: 32, rating: 4.6, barbers: 2, model: "Hybrid", tier: "Mid-tier" },
  { name: "Headlines Barber Lounge", neighborhood: "South Charlotte", zip: "28210", avgCut: 35, rating: 4.5, barbers: 3, model: "Appointment", tier: "Mid-tier" },
  { name: "Finesse Fades", neighborhood: "Airport Area", zip: "28208", avgCut: 25, rating: 4.4, barbers: 1, model: "Walk-in", tier: "Value" },
  { name: "Park Road Barbers", neighborhood: "Myers Park", zip: "28211", avgCut: 40, rating: 4.6, barbers: 2, model: "Appointment", tier: "Premium" },
  { name: "The Man Cave CLT", neighborhood: "North Charlotte", zip: "28216", avgCut: 25, rating: 4.4, barbers: 2, model: "Hybrid", tier: "Value" },
  { name: "Elite Grooming Studio", neighborhood: "Uptown", zip: "28202", avgCut: 38, rating: 4.5, barbers: 4, model: "Appointment", tier: "Premium" }
];

const SOCIAL_LEADERS = [
  { rank: 1,  name: "The Parlour CLT",         type: "Shop",   platform: "TikTok",    followers: 32100,  engagement: "8.1%" },
  { rank: 2,  name: "D. Tha Barber",           type: "Barber", platform: "TikTok",    followers: 22400,  engagement: "9.2%" },
  { rank: 3,  name: "Fresh Fades CLT",         type: "Shop",   platform: "Instagram", followers: 18200,  engagement: "5.8%" },
  { rank: 4,  name: "The Cut Lab",             type: "Shop",   platform: "TikTok",    followers: 15600,  engagement: "7.8%" },
  { rank: 5,  name: "Crown & Blade Barbershop",type: "Shop",   platform: "Instagram", followers: 14500,  engagement: "6.2%" },
  { rank: 6,  name: "Jay the Barber",          type: "Barber", platform: "Instagram", followers: 11800,  engagement: "7.4%" },
  { rank: 7,  name: "Elite Grooming Studio",   type: "Shop",   platform: "TikTok",    followers: 10200,  engagement: "6.0%" },
  { rank: 8,  name: "Mike Blendz",             type: "Barber", platform: "Instagram", followers: 9400,   engagement: "6.9%" },
  { rank: 9,  name: "704 Barbershop",          type: "Shop",   platform: "YouTube",   followers: 8900,   engagement: "4.3%" },
  { rank: 10, name: "Next Level Barbershop",   type: "Shop",   platform: "Instagram", followers: 7200,   engagement: "5.1%" },
  { rank: 11, name: "Gentlemen's Quarter",     type: "Shop",   platform: "Instagram", followers: 6100,   engagement: "4.7%" },
  { rank: 12, name: "Razor Sharp Studios",     type: "Shop",   platform: "Instagram", followers: 5300,   engagement: "5.5%" },
  { rank: 13, name: "Queen City Cutz",         type: "Shop",   platform: "Instagram", followers: 4800,   engagement: "4.1%" },
  { rank: 14, name: "Headlines Barber Lounge", type: "Shop",   platform: "Instagram", followers: 3900,   engagement: "4.5%" },
  { rank: 15, name: "Ace the Barber",          type: "Barber", platform: "YouTube",   followers: 3200,   engagement: "3.8%" }
];

const MARKET_MOVES = [
  { type: "Partnership",    title: "704 Barbershop partners with Charlotte FC",                detail: "704 Barbershop became the official grooming partner of Charlotte FC, providing matchday pop-up cuts at Bank of America Stadium and social media co-promotions.",                          impact: "High",   date: "2026-03-01" },
  { type: "Expansion",      title: "Elite Grooming opens second Charlotte location",           detail: "Elite Grooming Studio signed a lease for a 1,800 sq ft space in South End (28203), targeting a Q2 2026 opening. This will be their second Charlotte location after Uptown.",              impact: "High",   date: "2026-02-15" },
  { type: "Product Launch", title: "Gentlemen's Quarter launches private-label grooming line",  detail: "Dilworth-based Gentlemen's Quarter launched a 6-product grooming line (pomade, beard oil, aftershave, shampoo, conditioner, styling cream) sold in-shop and online.",                     impact: "Medium", date: "2026-02-01" },
  { type: "Price Increase", title: "Crown & Blade raises base haircut price to $40",           detail: "Crown & Blade increased Men's Haircut from $35 to $40 and Fade from $40 to $45, citing rising rent in South End. Beard Trim held at $20.",                                              impact: "Medium", date: "2026-01-20" },
  { type: "Price Increase", title: "Sport Clips adjusts regional pricing upward",              detail: "Sport Clips corporate rolled out a regional price adjustment — Men's Haircut moved from $22 to $25, aligning Steele Creek with other Charlotte-area franchise locations.",               impact: "Low",    date: "2026-02-10" },
  { type: "Expansion",      title: "The Parlour CLT adds second chair and apprentice program", detail: "The Parlour expanded from 2 to 3 barbers and launched an apprentice program partnering with local barber schools. Capacity increase of roughly 33%.",                                    impact: "Medium", date: "2026-01-15" },
  { type: "Rebrand",        title: "Fresh Fades CLT rebrands with new identity",               detail: "Fresh Fades completed a full rebrand including new logo, interior renovation, and updated social media presence. Repositioning from walk-in budget shop to mid-tier hybrid model.",       impact: "Low",    date: "2026-01-05" },
  { type: "New Opening",    title: "The Man Cave CLT opens gaming-lounge barbershop",          detail: "New concept shop opened in North Charlotte combining barbering with a gaming lounge. Targeting 18-35 demographic with competitive pricing at $25 haircuts.",                              impact: "Medium", date: "2025-11-10" }
];

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
      "<td>" + c.rating.toFixed(1) + "</td>" +
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
