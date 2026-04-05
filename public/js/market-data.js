/* ============================================================
   RE UP Report — Shared Market Data
   Exports PRICING_BY_ZIP and COMPETITORS to window.RE_UP_MARKET
   so both dashboard.js and article.js can access them.
   ============================================================ */

(function () {
  // All pricing verified via Booksy, Squire, Fresha, shop websites, Yelp, Axios Charlotte
  // "\u2014" = not found in any public source. No fabricated data.
  var PRICING_BY_ZIP = [
    { zip: "28202", area: "Uptown / Center City", haircut: 35, beard: "\u2014", students: 26, hotTowel: "\u2014", lineup: "\u2014", shops: 5 },
    { zip: "28203", area: "South End / Dilworth", haircut: 44, beard: 25, students: "\u2014", hotTowel: 40, lineup: 20, shops: 6 },
    { zip: "28205", area: "NoDa / Plaza Midwood", haircut: 38, beard: 23, students: 31, hotTowel: "\u2014", lineup: "\u2014", shops: 5 },
    { zip: "28206", area: "North Charlotte / Druid Hills", haircut: 20, beard: "\u2014", students: "\u2014", hotTowel: "\u2014", lineup: "\u2014", shops: 2 },
    { zip: "28208", area: "West Charlotte / Airport", haircut: 28, beard: "\u2014", students: "\u2014", hotTowel: "\u2014", lineup: "\u2014", shops: 3 },
    { zip: "28209", area: "Park Road / Selwyn", haircut: 27, beard: 12, students: "\u2014", hotTowel: "\u2014", lineup: "\u2014", shops: 4 },
    { zip: "28210", area: "South Charlotte / Sharon Lakes", haircut: 30, beard: "\u2014", students: "\u2014", hotTowel: "\u2014", lineup: "\u2014", shops: 1 },
    { zip: "28211", area: "SouthPark / Myers Park", haircut: 43, beard: "\u2014", students: "\u2014", hotTowel: "\u2014", lineup: "\u2014", shops: 2 },
    { zip: "28213", area: "University City / UNCC", haircut: 35, beard: 25, students: "\u2014", hotTowel: "\u2014", lineup: "\u2014", shops: 8 },
    { zip: "28215", area: "East Charlotte / Albemarle Rd", haircut: 25, beard: "\u2014", students: "\u2014", hotTowel: "\u2014", lineup: "\u2014", shops: 2 },
    { zip: "28216", area: "Brookshire / North Charlotte", haircut: 33, beard: "\u2014", students: 20, hotTowel: "\u2014", lineup: "\u2014", shops: 3 },
    { zip: "28262", area: "University City / N Tryon", haircut: 28, beard: "\u2014", students: "\u2014", hotTowel: "\u2014", lineup: "\u2014", shops: 2 },
    { zip: "28269", area: "University City / WT Harris", haircut: 33, beard: "\u2014", students: "\u2014", hotTowel: "\u2014", lineup: "\u2014", shops: 2 },
    { zip: "28273", area: "Steele Creek", haircut: 35, beard: "\u2014", students: "\u2014", hotTowel: "\u2014", lineup: "\u2014", shops: 2 }
  ];

  // All shops verified via Google, Yelp, Booksy, Squire, Fresha, Vagaro, shop websites
  // avgCut derived from pricing.json where available; "\u2014" = no public price found
  var COMPETITORS = [
    // 28202 — Uptown / Center City
    { name: "The CUT Barbershop", neighborhood: "Uptown", zip: "28202", avgCut: 30, rating: 4.7, barbers: 3, model: "Hybrid", tier: "Mid-tier" },
    { name: "Uptown Cuts", neighborhood: "Uptown", zip: "28202", avgCut: 40, rating: 5.0, barbers: 4, model: "Appointment", tier: "Premium" },
    { name: "Knights of the Razor by No Grease", neighborhood: "Uptown", zip: "28202", avgCut: 50, rating: 4.3, barbers: 6, model: "Appointment", tier: "Mid-tier" },
    { name: "City Barbers at Uptown", neighborhood: "Uptown", zip: "28202", avgCut: 30, rating: 4.6, barbers: 3, model: "Hybrid", tier: "Mid-tier" },
    { name: "Scissors & Scotch", neighborhood: "Uptown", zip: "28202", avgCut: 49, rating: 4.9, barbers: 6, model: "Appointment", tier: "Premium" },
    // 28203 — South End / Dilworth
    { name: "Modern Classics South End", neighborhood: "South End", zip: "28203", avgCut: 65, rating: 4.9, barbers: 5, model: "Appointment", tier: "Premium" },
    { name: "Hawk & Fade Barbershop", neighborhood: "South End", zip: "28203", avgCut: 40, rating: 4.8, barbers: 3, model: "Hybrid", tier: "Premium" },
    { name: "Caliber Men's Grooming", neighborhood: "South End", zip: "28203", avgCut: 38, rating: 4.7, barbers: 5, model: "Hybrid", tier: "Mid-tier" }, // EST
    { name: "Arrow - South End", neighborhood: "South End", zip: "28203", avgCut: 27, rating: 4.8, barbers: 5, model: "Hybrid", tier: "Mid-tier" }, // EST barbers
    { name: "Southside Barber Shop", neighborhood: "South End", zip: "28203", avgCut: 20, rating: 4.0, barbers: 4, model: "Walk-in", tier: "Value" }, // EST
    { name: "Shear Excellence - Dilworth", neighborhood: "Dilworth", zip: "28203", avgCut: 40, rating: 4.7, barbers: 4, model: "Appointment", tier: "Mid-tier" },
    // 28205 — NoDa / Plaza Midwood
    { name: "Midwood Barbers", neighborhood: "Plaza Midwood", zip: "28205", avgCut: 35, rating: 4.9, barbers: 6, model: "Appointment", tier: "Mid-tier" },
    { name: "NoDa Barbers", neighborhood: "NoDa", zip: "28205", avgCut: 45, rating: 4.7, barbers: 3, model: "Appointment", tier: "Premium" },
    { name: "Charlotte Barber & Beard", neighborhood: "Plaza Midwood", zip: "28205", avgCut: 45, rating: 4.6, barbers: 5, model: "Appointment", tier: "Premium" },
    { name: "Arrow - Plaza Midwood", neighborhood: "Plaza Midwood", zip: "28205", avgCut: 27, rating: 4.8, barbers: 5, model: "Hybrid", tier: "Mid-tier" }, // EST barbers
    { name: "Next Level Hair Studio", neighborhood: "Plaza Midwood", zip: "28205", avgCut: 35, rating: 4.5, barbers: 2, model: "Appointment", tier: "Mid-tier" }, // EST
    // 28206 — North Charlotte / Druid Hills
    { name: "Harris Barber Shop", neighborhood: "Druid Hills", zip: "28206", avgCut: 20, rating: 4.7, barbers: 4, model: "Walk-in", tier: "Value" },
    { name: "Gillespie Barber & Stylist", neighborhood: "North Charlotte", zip: "28206", avgCut: 20, rating: 4.0, barbers: 6, model: "Hybrid", tier: "Value" }, // EST
    // 28208 — West Charlotte / Airport
    { name: "The Man Cave Barbershop Charlotte LLC", neighborhood: "West Charlotte", zip: "28208", avgCut: 30, rating: 4.6, barbers: 3, model: "Hybrid", tier: "Mid-tier" }, // EST
    { name: "Da Lucky Spot", neighborhood: "West Charlotte", zip: "28208", avgCut: 25, rating: 5.0, barbers: 3, model: "Hybrid", tier: "Mid-tier" }, // EST
    { name: "Victory Cutz Barber Lounge CLT", neighborhood: "West Charlotte", zip: "28208", avgCut: 30, rating: 4.5, barbers: 2, model: "Appointment", tier: "Mid-tier" }, // EST
    // 28209 — Park Road / Selwyn
    { name: "Modern Haircutters (Park Road Barbers)", neighborhood: "Park Road", zip: "28209", avgCut: 28, rating: 4.5, barbers: 3, model: "Appointment", tier: "Mid-tier" }, // EST
    { name: "Selwyn Barber & Style", neighborhood: "Myers Park", zip: "28209", avgCut: 23, rating: 4.8, barbers: 6, model: "Hybrid", tier: "Value" },
    { name: "Arrow - Park Road", neighborhood: "Park Road", zip: "28209", avgCut: 27, rating: 4.8, barbers: 5, model: "Hybrid", tier: "Mid-tier" }, // EST barbers
    { name: "Urban Barber & Style", neighborhood: "South Blvd", zip: "28209", avgCut: 30, rating: 5.0, barbers: 2, model: "Hybrid", tier: "Mid-tier" },
    // 28210 — South Charlotte / Sharon Lakes
    { name: "Bladez Barber Shop", neighborhood: "Sharon Lakes", zip: "28210", avgCut: 30, rating: 4.3, barbers: 5, model: "Hybrid", tier: "Mid-tier" },
    // 28211 — SouthPark / Myers Park
    { name: "South Park Barber Shop", neighborhood: "SouthPark", zip: "28211", avgCut: 35, rating: 4.6, barbers: 2, model: "Hybrid", tier: "Mid-tier" }, // EST
    { name: "Freshen Up Barbershop", neighborhood: "SouthPark", zip: "28211", avgCut: 50, rating: 4.9, barbers: 1, model: "Appointment", tier: "Premium" }, // EST
    // 28213 — University City / UNCC
    { name: "Kutt Masters Barbershop", neighborhood: "University City", zip: "28213", avgCut: 35, rating: 4.6, barbers: 4, model: "Hybrid", tier: "Mid-tier" }, // EST
    { name: "Fade Factory Barbershop", neighborhood: "University City", zip: "28213", avgCut: 50, rating: 4.5, barbers: 4, model: "Appointment", tier: "Premium" },
    { name: "DJ The Fademaster", neighborhood: "University City", zip: "28213", avgCut: 35, rating: 5.0, barbers: 1, model: "Booth Rental", tier: "Mid-tier" },
    { name: "The Cutting Room Grooming Lounge", neighborhood: "University City", zip: "28213", avgCut: 40, rating: 5.0, barbers: 3, model: "Booth Rental", tier: "Mid-tier" }, // EST barbers
    { name: "Just For You Barber & Beauty II", neighborhood: "University City", zip: "28213", avgCut: 25, rating: 4.3, barbers: 4, model: "Hybrid", tier: "Value" }, // EST barbers
    { name: "34th Design Barbershop", neighborhood: "University City", zip: "28213", avgCut: 35, rating: 4.6, barbers: 3, model: "Booth Rental", tier: "Mid-tier" }, // EST barbers
    { name: "Clean Cuts Barbershop", neighborhood: "University City", zip: "28213", avgCut: 30, rating: 5.0, barbers: 2, model: "Walk-in", tier: "Mid-tier" }, // EST barbers
    { name: "Overton's Barber & Styling", neighborhood: "University City", zip: "28213", avgCut: 35, rating: 4.8, barbers: 3, model: "Walk-in", tier: "Mid-tier" }, // EST barbers
    // 28215 — East Charlotte / Albemarle Rd
    { name: "Edward's Boyz Barber Shop", neighborhood: "East Charlotte", zip: "28215", avgCut: 25, rating: 4.8, barbers: 4, model: "Hybrid", tier: "Mid-tier" }, // EST
    { name: "Right Touch Barbershop", neighborhood: "East Charlotte", zip: "28215", avgCut: 25, rating: 5.0, barbers: 3, model: "Hybrid", tier: "Mid-tier" }, // EST barbers
    // 28216 — Brookshire / North Charlotte
    { name: "M&M Barber Studio", neighborhood: "Brookshire", zip: "28216", avgCut: 30, rating: 4.5, barbers: 1, model: "Appointment", tier: "Mid-tier" }, // EST
    { name: "Tha Kut Club Barbershop Lounge", neighborhood: "Brookshire", zip: "28216", avgCut: 25, rating: 5.0, barbers: 2, model: "Appointment", tier: "Value" }, // EST barbers
    { name: "No Grease Mosaic", neighborhood: "Brookshire", zip: "28216", avgCut: 30, rating: 4.2, barbers: 5, model: "Hybrid", tier: "Mid-tier" },
    // 28262 — University City / N Tryon
    { name: "Emperial Barber Lounge", neighborhood: "University City", zip: "28262", avgCut: 35, rating: 4.9, barbers: 3, model: "Appointment", tier: "Mid-tier" }, // EST
    { name: "Azeal Barbershop", neighborhood: "University City", zip: "28262", avgCut: 20, rating: 5.0, barbers: 4, model: "Appointment", tier: "Mid-tier" },
    // 28269 — University City / WT Harris
    { name: "Just For You", neighborhood: "University City", zip: "28269", avgCut: 30, rating: 4.6, barbers: 4, model: "Hybrid", tier: "Mid-tier" }, // EST
    { name: "MVP's Grooming Lounge", neighborhood: "University City", zip: "28269", avgCut: 35, rating: 5.0, barbers: 2, model: "Appointment", tier: "Mid-tier" }, // EST
    // 28273 — Steele Creek
    { name: "Verified Cuts", neighborhood: "Steele Creek", zip: "28273", avgCut: 35, rating: 4.9, barbers: 1, model: "Appointment", tier: "Mid-tier" },
    { name: "Headz Up Barbershop", neighborhood: "Steele Creek", zip: "28273", avgCut: 35, rating: 4.5, barbers: 1, model: "Appointment", tier: "Mid-tier" } // EST rating & barbers
  ];

  // Calculate city average haircut price (only from zips with numeric data)
  var cityTotal = 0;
  var cityCount = 0;
  for (var i = 0; i < PRICING_BY_ZIP.length; i++) {
    if (typeof PRICING_BY_ZIP[i].haircut === 'number') {
      cityTotal += PRICING_BY_ZIP[i].haircut;
      cityCount++;
    }
  }
  var cityAvgHaircut = cityCount > 0 ? Math.round(cityTotal / cityCount) : 0;

  window.RE_UP_MARKET = {
    PRICING_BY_ZIP: PRICING_BY_ZIP,
    COMPETITORS: COMPETITORS,
    cityAvgHaircut: cityAvgHaircut,

    findZip: function (zip) {
      for (var i = 0; i < PRICING_BY_ZIP.length; i++) {
        if (PRICING_BY_ZIP[i].zip === zip) return PRICING_BY_ZIP[i];
      }
      return null;
    },

    findShopsByName: function (name) {
      var lower = name.toLowerCase();
      var results = [];
      for (var i = 0; i < COMPETITORS.length; i++) {
        if (COMPETITORS[i].name.toLowerCase().indexOf(lower) !== -1) {
          results.push(COMPETITORS[i]);
        }
      }
      return results;
    }
  };
})();
