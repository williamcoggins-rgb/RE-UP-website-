// ──────────────────────────────────────────────────────────────
// RE UP — Charlotte Barbershop Verified Price Overrides
// Researched via Booksy, Squire, Fresha, Yelp, shop websites,
// and Axios Charlotte. Sources noted per entry.
// pricing_source values: 'verified' (exact price found),
//   'estimated' (derived from combo/tier), 'null' (not found)
// ──────────────────────────────────────────────────────────────

export var CHARLOTTE_PRICE_OVERRIDES = {

  // ── 28202 · Uptown / Center City ──────────────────────────────
  "The CUT Barbershop": { haircut: 30, beard: null, barbers: null, source: "yelp" },
  "Uptown Cuts": { haircut: 40, beard: 10, barbers: null, source: "website" },
  "Scissors & Scotch": { haircut: 49, beard: null, barbers: null, source: "website" },
  "The Cutting Company": { haircut: 50, beard: null, barbers: null, source: "website" },
  "City Barbers at Uptown": { haircut: 30, beard: null, barbers: null, source: "booksy" },
  "Knights of the Razor by No Grease": { haircut: 45, beard: 10, barbers: null, source: "squire" },

  // ── 28203 · South End / Dilworth ──────────────────────────────
  "Hawk & Fade Barbershop": { haircut: 40, beard: 20, barbers: null, source: "booksy" },
  "Modern Classics Barbershop South End": { haircut: 65, beard: 20, barbers: 7, source: "booksy" },
  "Modern Classics": { haircut: 65, beard: 20, barbers: 7, source: "booksy" },
  "Arrow South End": { haircut: 27, beard: 15, barbers: null, source: "yelp" },

  // ── 28205 · NoDa / Plaza Midwood ──────────────────────────────
  "Olde Charlotte Barbershop": { haircut: 40, beard: 20, barbers: 4, source: "booksy" },
  "Charlotte Barber & Beard": { haircut: 40, beard: 30, barbers: 1, source: "booksy" },
  "Charlotte Barber and Beard": { haircut: 40, beard: 30, barbers: 1, source: "booksy" },
  "Midwood Barbers": { haircut: 35, beard: 25, barbers: null, source: "booksy" },
  "Arrow Plaza Midwood": { haircut: 27, beard: 15, barbers: null, source: "yelp" },

  // ── 28209 · Park Road / Selwyn ────────────────────────────────
  "Selwyn Barber & Style": { haircut: 20, beard: null, barbers: null, source: "yelp" },
  "Selwyn Barber and Style": { haircut: 20, beard: null, barbers: null, source: "yelp" },
  "Arrow Park Road": { haircut: 25, beard: 15, barbers: null, source: "yelp" },

  // ── 28210 · South Charlotte / Sharon Lakes ────────────────────
  "Bladez Barber Shop": { haircut: 30, beard: null, barbers: 5, source: "booksy" },
  "Bladez Barbershop": { haircut: 30, beard: null, barbers: 5, source: "booksy" },

  // ── 28211 · SouthPark / Myers Park ────────────────────────────
  "Freshen Up Barbershop": { haircut: 50, beard: null, barbers: 1, source: "booksy" },

  // ── 28212 · Eastland / Albemarle ──────────────────────────────
  "Headlines Barber Shop": { haircut: 30, beard: null, barbers: 9, source: "booksy" },
  "Headlines Barbershop": { haircut: 30, beard: null, barbers: 9, source: "booksy" },

  // ── 28213 · University City / UNCC ────────────────────────────
  "Fade Factory Barbershop": { haircut: 35, beard: null, barbers: null, source: "website" },
  "The Cutting Room Grooming Lounge": { haircut: null, beard: null, barbers: null, source: "booksy" },

  // ── 28215 · East Charlotte / Albemarle Rd ─────────────────────
  "Right Touch Barbershop": { haircut: 25, beard: null, barbers: null, source: "website" },

  // ── 28216 · Brookshire / North Charlotte ─────────────────────
  "No Grease Northlake": { haircut: 45, beard: 10, barbers: null, source: "squire" },
  "El Patio Unisex Salon and Barbershop": { haircut: 30, beard: null, barbers: null, source: "booksy" },
  "El Patio Barbershop": { haircut: 30, beard: null, barbers: null, source: "booksy" },
  "No Grease Mosaic": { haircut: 30, beard: null, barbers: null, source: "booksy" },
  "Mosaic No Grease": { haircut: 30, beard: null, barbers: null, source: "booksy" },

  // ── 28217 · South Blvd / Tyvola ───────────────────────────────
  "Negron Barber": { haircut: 45, beard: null, barbers: 1, source: "booksy" },
  "D'Kache Barbershop & Salon": { haircut: 25, beard: null, barbers: null, source: "booksy" },
  "D'Kache Barbershop": { haircut: 25, beard: null, barbers: null, source: "booksy" },
  "Dkache Barbershop": { haircut: 25, beard: null, barbers: null, source: "booksy" },
  "Pablo's Barbershop & Salon": { haircut: 45, beard: null, barbers: 10, source: "booksy" },
  "Pablos Barbershop": { haircut: 45, beard: null, barbers: 10, source: "booksy" },
  "V's Barbershop Charlotte": { haircut: 28, beard: null, barbers: null, source: "website" },
  "Vs Barbershop": { haircut: 28, beard: null, barbers: null, source: "website" },

  // ── 28226 · Pineville / South Charlotte ──────────────────────
  "The Cut Lounge By Lyric Da Barber": { haircut: 30, beard: 30, barbers: 1, source: "booksy" },
  "The Cut Lounge": { haircut: 30, beard: 30, barbers: 1, source: "booksy" },

  // ── 28262 · University City / N Tryon ─────────────────────────
  "NY 2 QC Kutz": { haircut: 25, beard: null, barbers: null, source: "booksy" },
  "Yanil Barber": { haircut: 50, beard: null, barbers: null, source: "booksy" },

  // ── 28269 · University City / WT Harris ───────────────────────
  "Just For You": { haircut: 30, beard: null, barbers: null, source: "booksy" },
  "MVP's Grooming Lounge": { haircut: 35, beard: null, barbers: 2, source: "booksy" },
  "MVPs Grooming Lounge": { haircut: 35, beard: null, barbers: 2, source: "booksy" },

  // ── 28270 · Matthews / Monroe Road ───────────────────────────
  "All Cutz Matter Barbershop": { haircut: 30, beard: null, barbers: 1, source: "booksy" },
  "All Cutz Matter": { haircut: 30, beard: null, barbers: 1, source: "booksy" },
  "Matthews Barber Shop 2": { haircut: 15, beard: 6, barbers: null, source: "website" },

  // ── 28273 · Steele Creek ──────────────────────────────────────
  "Verified Cuts": { haircut: 35, beard: null, barbers: 1, source: "booksy" },
  "Headz Up Barbershop": { haircut: 35, beard: null, barbers: 1, source: "booksy" },
  "Floyd's 99 Barbershop": { haircut: 27, beard: 20, barbers: null, source: "website" },
  "Floyds 99 Barbershop": { haircut: 27, beard: 20, barbers: null, source: "website" },
  "Sport Clips": { haircut: 25, beard: null, barbers: null, source: "website" },
  "Knockouts Barber Shop": { haircut: 35, beard: null, barbers: 1, source: "booksy" },
  "Knockouts Barbershop": { haircut: 35, beard: null, barbers: 1, source: "booksy" },
  "Bigcutz Barbering Services": { haircut: 45, beard: 30, barbers: null, source: "booksy" },
  "Bigcutz": { haircut: 45, beard: 30, barbers: null, source: "booksy" },
  "Saul G Barber": { haircut: 40, beard: null, barbers: 1, source: "booksy" },

  // ── 28277 · Ballantyne ────────────────────────────────────────
  "The Hair Cave": { haircut: 35, beard: 20, barbers: null, source: "booksy" },
  "Hair Cave": { haircut: 35, beard: 20, barbers: null, source: "booksy" },
  "R&L Barbershop": { haircut: 23, beard: null, barbers: null, source: "yelp" },
  "R and L Barbershop": { haircut: 23, beard: null, barbers: null, source: "yelp" },
  "Ec Cutz": { haircut: 35, beard: null, barbers: 1, source: "booksy" },
  "Roosters Men's Grooming Center": { haircut: 39, beard: 17, barbers: null, source: "website" },
  "Roosters Mens Grooming": { haircut: 39, beard: 17, barbers: null, source: "website" },
  "Roosters": { haircut: 39, beard: 17, barbers: null, source: "website" },

  // ── 28278 · Lake Wylie / SW Charlotte ────────────────────────
  "The Barber Lounge Lake Wylie": { haircut: 28, beard: null, barbers: null, source: "website" },
  "Barber Lounge Lake Wylie": { haircut: 28, beard: null, barbers: null, source: "website" }
};

/**
 * Normalize a shop name for fuzzy matching.
 * Lowercases, strips punctuation and common filler words.
 */
export function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[''`]/g, '')          // remove apostrophes
    .replace(/&/g, 'and')           // & → and
    .replace(/[^a-z0-9\s]/g, ' ')  // strip remaining punctuation
    .replace(/\b(the|a|an|by|at|of|llc|inc|co)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Look up a shop name in the overrides map.
 * Tries exact match first, then normalized partial match.
 * Returns the override object or null.
 */
export function lookupOverride(shopName) {
  if (!shopName) return null;

  // 1. Exact match
  if (CHARLOTTE_PRICE_OVERRIDES[shopName]) {
    return CHARLOTTE_PRICE_OVERRIDES[shopName];
  }

  var normalShop = normalizeName(shopName);
  var keys = Object.keys(CHARLOTTE_PRICE_OVERRIDES);

  // 2. Normalized exact match
  for (var i = 0; i < keys.length; i++) {
    if (normalizeName(keys[i]) === normalShop) {
      return CHARLOTTE_PRICE_OVERRIDES[keys[i]];
    }
  }

  // 3. Partial match: override key is contained in shop name or vice versa
  for (var j = 0; j < keys.length; j++) {
    var normalKey = normalizeName(keys[j]);
    // Only match if the shorter string is at least 8 chars (avoids "Arrow" matching "Arrow Park Road" wrong way)
    if (normalKey.length >= 8 && (normalShop.indexOf(normalKey) !== -1 || normalKey.indexOf(normalShop) !== -1)) {
      return CHARLOTTE_PRICE_OVERRIDES[keys[j]];
    }
  }

  return null;
}
