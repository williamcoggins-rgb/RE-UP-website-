/* ============================================================
   RE UP Report — Charlotte Market Dashboard
   js/dashboard.js
   ============================================================ */

// --------------- SEED DATA ---------------

const PRICING_BY_ZIP = [
  { zip: "28202", area: "Uptown/Center City", haircut: 40, fade: 45, beard: 25, kids: 30, hotTowel: 38, lineup: 18, shops: 6 },
  { zip: "28203", area: "South End/Dilworth", haircut: 38, fade: 42, beard: 22, kids: 28, hotTowel: 35, lineup: 16, shops: 5 },
  { zip: "28204", area: "Elizabeth/Myers Park", haircut: 42, fade: 48, beard: 28, kids: 32, hotTowel: 40, lineup: 20, shops: 3 },
  { zip: "28205", area: "Plaza Midwood/NoDa", haircut: 35, fade: 38, beard: 20, kids: 25, hotTowel: 32, lineup: 15, shops: 7 },
  { zip: "28206", area: "North Charlotte", haircut: 25, fade: 28, beard: 14, kids: 18, hotTowel: 25, lineup: 12, shops: 4 },
  { zip: "28208", area: "West Charlotte", haircut: 25, fade: 28, beard: 15, kids: 18, hotTowel: 24, lineup: 12, shops: 8 },
  { zip: "28210", area: "South Charlotte", haircut: 32, fade: 35, beard: 18, kids: 22, hotTowel: 30, lineup: 14, shops: 4 },
  { zip: "28211", area: "SouthPark", haircut: 45, fade: 50, beard: 30, kids: 35, hotTowel: 42, lineup: 22, shops: 3 },
  { zip: "28215", area: "East Charlotte", haircut: 22, fade: 25, beard: 12, kids: 15, hotTowel: 22, lineup: 10, shops: 6 },
  { zip: "28216", area: "University City", haircut: 28, fade: 30, beard: 15, kids: 20, hotTowel: 26, lineup: 13, shops: 4 },
  { zip: "28217", area: "Steele Creek", haircut: 30, fade: 33, beard: 17, kids: 22, hotTowel: 28, lineup: 14, shops: 3 },
  { zip: "28269", area: "Harrisburg/Concord", haircut: 28, fade: 32, beard: 16, kids: 20, hotTowel: 27, lineup: 13, shops: 5 }
];

const COMPETITORS = [
  { name: "Crown & Blade Barbershop", neighborhood: "South End", zip: "28203", avgCut: 42, rating: 4.8, barbers: 5, model: "Appointment", tier: "Premium" },
  { name: "QC Kutz", neighborhood: "West Charlotte", zip: "28208", avgCut: 22, rating: 4.3, barbers: 4, model: "Walk-in", tier: "Value" },
  { name: "TheRefinery CLT", neighborhood: "Uptown", zip: "28202", avgCut: 55, rating: 4.9, barbers: 6, model: "Appointment", tier: "Premium" },
  { name: "704 Barbershop", neighborhood: "Plaza Midwood", zip: "28205", avgCut: 35, rating: 4.6, barbers: 3, model: "Both", tier: "Mid-tier" },
  { name: "Fresh Fades Charlotte", neighborhood: "North Charlotte", zip: "28206", avgCut: 25, rating: 4.2, barbers: 3, model: "Walk-in", tier: "Value" },
  { name: "Legends Barbershop", neighborhood: "East Charlotte", zip: "28215", avgCut: 20, rating: 4.1, barbers: 4, model: "Walk-in", tier: "Value" },
  { name: "Bishops Cuts/Color", neighborhood: "SouthPark", zip: "28211", avgCut: 48, rating: 4.5, barbers: 7, model: "Appointment", tier: "Premium" },
  { name: "The Cut Above CLT", neighborhood: "NoDa", zip: "28205", avgCut: 38, rating: 4.7, barbers: 4, model: "Both", tier: "Mid-tier" },
  { name: "Sport Clips (Steele Creek)", neighborhood: "Steele Creek", zip: "28217", avgCut: 28, rating: 3.9, barbers: 6, model: "Walk-in", tier: "Value" },
  { name: "King's Throne Barber Lounge", neighborhood: "Uptown", zip: "28202", avgCut: 50, rating: 4.8, barbers: 5, model: "Appointment", tier: "Premium" },
  { name: "Next Level Barbershop", neighborhood: "University City", zip: "28216", avgCut: 30, rating: 4.4, barbers: 3, model: "Both", tier: "Mid-tier" },
  { name: "Clip Joint CLT", neighborhood: "Dilworth", zip: "28203", avgCut: 40, rating: 4.6, barbers: 4, model: "Appointment", tier: "Mid-tier" },
  { name: "Faded Royalty", neighborhood: "West Charlotte", zip: "28208", avgCut: 18, rating: 4.0, barbers: 2, model: "Walk-in", tier: "Value" },
  { name: "Groom CLT", neighborhood: "Elizabeth", zip: "28204", avgCut: 45, rating: 4.7, barbers: 3, model: "Appointment", tier: "Premium" },
  { name: "Great Clips (Harrisburg)", neighborhood: "Harrisburg", zip: "28269", avgCut: 22, rating: 3.7, barbers: 5, model: "Walk-in", tier: "Value" },
  { name: "Myers Park Barber", neighborhood: "Myers Park", zip: "28204", avgCut: 50, rating: 4.9, barbers: 2, model: "Appointment", tier: "Premium" },
  { name: "Queen City Cutz", neighborhood: "South Charlotte", zip: "28210", avgCut: 32, rating: 4.5, barbers: 4, model: "Both", tier: "Mid-tier" },
  { name: "The Man Cave Barbershop", neighborhood: "East Charlotte", zip: "28215", avgCut: 20, rating: 4.3, barbers: 3, model: "Walk-in", tier: "Value" },
  { name: "Finley's Barber & Snip", neighborhood: "SouthPark", zip: "28211", avgCut: 44, rating: 4.4, barbers: 5, model: "Both", tier: "Mid-tier" },
  { name: "Trendsetters Barbershop", neighborhood: "West Charlotte", zip: "28208", avgCut: 24, rating: 4.2, barbers: 3, model: "Walk-in", tier: "Value" }
];

const SOCIAL_LEADERS = [
  { rank: 1,  name: "Jay the Barber",       type: "Barber", platform: "Instagram", followers: 48200,  engagement: "5.1%" },
  { rank: 2,  name: "Crown & Blade",        type: "Shop",   platform: "Instagram", followers: 34800,  engagement: "3.8%" },
  { rank: 3,  name: "CLT Fades",            type: "Barber", platform: "TikTok",    followers: 31500,  engagement: "7.2%" },
  { rank: 4,  name: "The Refinery CLT",     type: "Shop",   platform: "Instagram", followers: 27600,  engagement: "4.1%" },
  { rank: 5,  name: "DreamsToFades",        type: "Barber", platform: "TikTok",    followers: 24100,  engagement: "6.8%" },
  { rank: 6,  name: "King's Throne Lounge", type: "Shop",   platform: "Instagram", followers: 21300,  engagement: "3.5%" },
  { rank: 7,  name: "Niko Blendz",          type: "Barber", platform: "Instagram", followers: 19800,  engagement: "4.4%" },
  { rank: 8,  name: "704 Barbershop",       type: "Shop",   platform: "Instagram", followers: 16500,  engagement: "3.2%" },
  { rank: 9,  name: "Trey Cuts CLT",        type: "Barber", platform: "TikTok",    followers: 14700,  engagement: "8.1%" },
  { rank: 10, name: "Bishops Cuts/Color",   type: "Shop",   platform: "Instagram", followers: 13200,  engagement: "2.9%" },
  { rank: 11, name: "FadeMaster Mike",      type: "Barber", platform: "Instagram", followers: 11400,  engagement: "4.7%" },
  { rank: 12, name: "Groom CLT",            type: "Shop",   platform: "Instagram", followers: 9800,   engagement: "3.6%" },
  { rank: 13, name: "QueenCityBarber",      type: "Barber", platform: "TikTok",    followers: 8500,   engagement: "6.3%" },
  { rank: 14, name: "The Cut Above CLT",    type: "Shop",   platform: "Instagram", followers: 7200,   engagement: "3.0%" },
  { rank: 15, name: "Smooth Edgez",         type: "Barber", platform: "TikTok",    followers: 6100,   engagement: "9.4%" }
];

const MARKET_MOVES = [
  { type: "Expansion",    title: "Crown & Blade Opens Second Location",       detail: "Expanding from South End into NoDa with a 2,400 sq-ft flagship. Opening slated for Q2 2026.",                       impact: "High",   date: "2026-03-01" },
  { type: "Price Change", title: "The Refinery Raises Cut Price to $60",       detail: "Premium Uptown shop increases men's cut from $55 to $60, citing product cost increases.",                            impact: "Medium", date: "2026-02-18" },
  { type: "New Opening",  title: "Blended Society Debuts in South End",        detail: "New appointment-only concept shop launching at 1400 S. Tryon with four chairs and a retail bar.",                   impact: "High",   date: "2026-02-25" },
  { type: "Partnership",  title: "704 Barbershop x Bevel Product Partnership", detail: "Local independent partners with Bevel for exclusive in-shop product line and co-branded content.",                 impact: "Medium", date: "2026-02-10" },
  { type: "Price Change", title: "Sport Clips Drops Weekday Price to $24",     detail: "Steele Creek franchise tests weekday discount to drive chair utilization during off-peak hours.",                   impact: "Low",    date: "2026-01-28" },
  { type: "Expansion",    title: "Bishops Announces Third Charlotte Store",    detail: "National franchise targeting University City corridor for late 2026 opening.",                                      impact: "High",   date: "2026-03-05" },
  { type: "Rebrand",      title: "Fresh Fades Rebrands as Fade Factory",       detail: "North Charlotte shop rebrands with updated interior, new logo, and appointment system via Booksy.",                 impact: "Medium", date: "2026-02-01" },
  { type: "New Opening",  title: "Gentlemen's Republic Opening in SouthPark",  detail: "Luxury concept with lounge area, bourbon bar, and $65 signature cut. Targets the high-income SouthPark corridor.", impact: "High",   date: "2026-03-08" }
];

const DENSITY = PRICING_BY_ZIP.map(function (row) {
  return { zip: row.zip, area: row.area, count: row.shops };
});

// --------------- UTILITY HELPERS ---------------

function formatPrice(n) {
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
  "Expansion":    "#22c55e",
  "Price Change": "#eab308",
  "New Opening":  "#3b82f6",
  "Partnership":  "#a855f7",
  "Rebrand":      "#f97316"
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
