// ──────────────────────────────────────────────────────────────
// RE UP — Google Places API Server-Side Proxy
// Keeps API key secret on the edge. All client calls go through
// /api/places/* which this module handles.
// ──────────────────────────────────────────────────────────────

// Rate limiting per IP — 60 requests per minute
const rateLimits = new Map();
const MAX_REQUESTS = 60;
const WINDOW_MS = 60 * 1000;

// Charlotte metro bounding box — reject requests outside our market
const CLT_BOUNDS = {
  north: 35.55,
  south: 35.00,
  east: -80.55,
  west: -81.10
};

function getAllowedOrigin(request) {
  var origin = request.headers.get('Origin');
  var requestOrigin = new URL(request.url).origin;
  if (!origin) return requestOrigin;
  if (origin === requestOrigin) return origin;
  var allowed = ['https://reupreport.com', 'https://www.reupreport.com'];
  if (allowed.includes(origin)) return origin;
  return null;
}

function corsHeaders(request, methods) {
  var origin = getAllowedOrigin(request);
  return {
    'Access-Control-Allow-Origin': origin || '',
    'Access-Control-Allow-Methods': methods || 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Vary': 'Origin'
  };
}

function isRateLimited(ip) {
  var now = Date.now();
  var entry = rateLimits.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

function jsonResponse(data, status, request) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: Object.assign({ 'Content-Type': 'application/json' }, corsHeaders(request))
  });
}

function errorResponse(message, status, request) {
  return jsonResponse({ error: message }, status, request);
}

function isInCharlotteArea(lat, lng) {
  return lat >= CLT_BOUNDS.south && lat <= CLT_BOUNDS.north &&
         lng >= CLT_BOUNDS.west && lng <= CLT_BOUNDS.east;
}

// ── Nearby Search ──────────────────────────────────────────────
// GET /api/places/nearby?lat=X&lng=Y&radius=Z
async function handleNearby(url, apiKey, request) {
  var lat = parseFloat(url.searchParams.get('lat'));
  var lng = parseFloat(url.searchParams.get('lng'));
  var radius = parseInt(url.searchParams.get('radius')) || 5000;

  if (isNaN(lat) || isNaN(lng)) {
    return errorResponse('lat and lng are required', 400, request);
  }
  if (!isInCharlotteArea(lat, lng)) {
    return errorResponse('Coordinates outside Charlotte market area', 400, request);
  }
  // Cap radius at 50km
  radius = Math.min(radius, 50000);

  var endpoint = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json' +
    '?location=' + lat + ',' + lng +
    '&radius=' + radius +
    '&type=barber_shop' +       // Primary type
    '&keyword=barbershop' +     // Catches hair studios that do barber work
    '&key=' + apiKey;

  var pageToken = url.searchParams.get('pagetoken');
  if (pageToken) {
    endpoint += '&pagetoken=' + encodeURIComponent(pageToken);
  }

  var resp = await fetch(endpoint);
  var data = await resp.json();

  return jsonResponse({
    status: data.status,
    results: (data.results || []).map(normalizePlace),
    next_page_token: data.next_page_token || null
  }, 200, request);
}

// ── Text Search ────────────────────────────────────────────────
// GET /api/places/textsearch?q=barbershop+charlotte+nc
async function handleTextSearch(url, apiKey, request) {
  var query = url.searchParams.get('q');
  if (!query) {
    return errorResponse('q (query) is required', 400, request);
  }

  // Force Charlotte context if not present
  var lowerQ = query.toLowerCase();
  if (lowerQ.indexOf('charlotte') === -1 && lowerQ.indexOf('clt') === -1 && lowerQ.indexOf('282') === -1) {
    query += ' Charlotte NC';
  }

  var endpoint = 'https://maps.googleapis.com/maps/api/place/textsearch/json' +
    '?query=' + encodeURIComponent(query) +
    '&type=barber_shop' +
    '&key=' + apiKey;

  var pageToken = url.searchParams.get('pagetoken');
  if (pageToken) {
    endpoint += '&pagetoken=' + encodeURIComponent(pageToken);
  }

  var resp = await fetch(endpoint);
  var data = await resp.json();

  return jsonResponse({
    status: data.status,
    results: (data.results || []).map(normalizePlace),
    next_page_token: data.next_page_token || null
  }, 200, request);
}

// ── Place Details ──────────────────────────────────────────────
// GET /api/places/details/:placeId
async function handleDetails(placeId, apiKey, request) {
  if (!placeId) {
    return errorResponse('placeId is required', 400, request);
  }

  var fields = [
    'place_id', 'name', 'formatted_address', 'formatted_phone_number',
    'geometry', 'rating', 'user_ratings_total', 'price_level',
    'opening_hours', 'website', 'url', 'reviews', 'photos',
    'business_status', 'types'
  ].join(',');

  var endpoint = 'https://maps.googleapis.com/maps/api/place/details/json' +
    '?place_id=' + encodeURIComponent(placeId) +
    '&fields=' + fields +
    '&key=' + apiKey;

  var resp = await fetch(endpoint);
  var data = await resp.json();

  if (data.status !== 'OK') {
    return jsonResponse({ status: data.status, result: null }, 200, request);
  }

  return jsonResponse({
    status: 'OK',
    result: normalizeDetails(data.result)
  }, 200, request);
}

// ── Autocomplete ───────────────────────────────────────────────
// GET /api/places/autocomplete?input=fade+factory
async function handleAutocomplete(url, apiKey, request) {
  var input = url.searchParams.get('input');
  if (!input) {
    return errorResponse('input is required', 400, request);
  }

  // Bias toward Charlotte metro
  var endpoint = 'https://maps.googleapis.com/maps/api/place/autocomplete/json' +
    '?input=' + encodeURIComponent(input) +
    '&types=establishment' +
    '&location=35.2271,-80.8431' +    // Charlotte center
    '&radius=40000' +                  // 40km radius
    '&strictbounds=true' +
    '&key=' + apiKey;

  var resp = await fetch(endpoint);
  var data = await resp.json();

  return jsonResponse({
    status: data.status,
    predictions: (data.predictions || []).map(function(p) {
      return {
        place_id: p.place_id,
        description: p.description,
        main_text: p.structured_formatting ? p.structured_formatting.main_text : p.description,
        secondary_text: p.structured_formatting ? p.structured_formatting.secondary_text : ''
      };
    })
  }, 200, request);
}

// ── Normalize helpers ──────────────────────────────────────────
// Strip to only what the frontend needs — no leaking raw Google payloads
function normalizePlace(place) {
  var loc = place.geometry && place.geometry.location ? place.geometry.location : {};
  return {
    place_id: place.place_id,
    name: place.name,
    address: place.vicinity || place.formatted_address || '',
    lat: loc.lat || null,
    lng: loc.lng || null,
    rating: place.rating || null,
    total_ratings: place.user_ratings_total || 0,
    price_level: place.price_level || null,
    open_now: place.opening_hours ? place.opening_hours.open_now : null,
    business_status: place.business_status || 'OPERATIONAL',
    types: place.types || []
  };
}

function normalizeDetails(result) {
  var loc = result.geometry && result.geometry.location ? result.geometry.location : {};
  return {
    place_id: result.place_id,
    name: result.name,
    address: result.formatted_address || '',
    phone: result.formatted_phone_number || null,
    website: result.website || null,
    maps_url: result.url || null,
    lat: loc.lat || null,
    lng: loc.lng || null,
    rating: result.rating || null,
    total_ratings: result.user_ratings_total || 0,
    price_level: result.price_level || null,
    business_status: result.business_status || 'OPERATIONAL',
    hours: result.opening_hours ? {
      open_now: result.opening_hours.open_now || false,
      periods: result.opening_hours.periods || [],
      weekday_text: result.opening_hours.weekday_text || []
    } : null,
    reviews: (result.reviews || []).slice(0, 5).map(function(r) {
      return {
        author: r.author_name,
        rating: r.rating,
        text: r.text,
        time: r.relative_time_description,
        profile_photo: r.profile_photo_url || null
      };
    }),
    photos: (result.photos || []).slice(0, 6).map(function(p) {
      return {
        reference: p.photo_reference,
        width: p.width,
        height: p.height
      };
    }),
    types: result.types || []
  };
}

// ── Photo proxy (prevents API key exposure in img src) ─────────
// GET /api/places/photo?ref=PHOTO_REFERENCE&maxwidth=400
async function handlePhoto(url, apiKey, request) {
  var ref = url.searchParams.get('ref');
  if (!ref) {
    return errorResponse('ref (photo_reference) is required', 400, request);
  }
  var maxwidth = parseInt(url.searchParams.get('maxwidth')) || 400;
  maxwidth = Math.min(maxwidth, 800);

  var endpoint = 'https://maps.googleapis.com/maps/api/place/photo' +
    '?photo_reference=' + encodeURIComponent(ref) +
    '&maxwidth=' + maxwidth +
    '&key=' + apiKey;

  var resp = await fetch(endpoint);

  // Stream the image back with appropriate headers
  var headers = Object.assign({
    'Content-Type': resp.headers.get('Content-Type') || 'image/jpeg',
    'Cache-Control': 'public, max-age=86400'
  }, corsHeaders(request));

  return new Response(resp.body, { status: resp.status, headers: headers });
}

// ── Charlotte Metro Sweep ─────────────────────────────────────
// GET /api/places/charlotte-shops
// Searches all Charlotte zip code centroids, deduplicates, caches 24h
var CLT_SEARCH_POINTS = [
  { lat: 35.2271, lng: -80.8431 },  // Uptown
  { lat: 35.2118, lng: -80.8587 },  // South End
  { lat: 35.2177, lng: -80.8247 },  // Plaza Midwood
  { lat: 35.2283, lng: -80.7971 },  // NoDa
  { lat: 35.2620, lng: -80.8107 },  // North Charlotte
  { lat: 35.2050, lng: -80.8190 },  // Myers Park
  { lat: 35.2230, lng: -80.9080 },  // West Charlotte
  { lat: 35.1810, lng: -80.8530 },  // Montford
  { lat: 35.1510, lng: -80.8770 },  // Quail Hollow
  { lat: 35.1800, lng: -80.8080 },  // SouthPark
  { lat: 35.1780, lng: -80.7450 },  // Idlewild
  { lat: 35.2870, lng: -80.7470 },  // University
  { lat: 35.2600, lng: -80.9540 },  // Moores Chapel
  { lat: 35.2490, lng: -80.7280 },  // Eastway
  { lat: 35.3100, lng: -80.8870 },  // Northlake
  { lat: 35.1700, lng: -80.9180 },  // Steele Creek
  { lat: 35.1180, lng: -80.8100 },  // Ballantyne
  { lat: 35.1610, lng: -80.6960 },  // Mint Hill
  { lat: 35.3370, lng: -80.7440 },  // University City
  { lat: 35.3420, lng: -80.8380 },  // Highland Creek
  { lat: 35.1130, lng: -80.7620 },  // Providence
  { lat: 35.1210, lng: -80.9510 },  // Lake Wylie area
  { lat: 35.0590, lng: -80.8470 },  // Ardrey Kell
  { lat: 35.1010, lng: -80.9710 }   // Berewick
];

var CACHE_KEY_URL = 'https://reup-internal-cache.reupreport.com/charlotte-shops-v3';
var CACHE_TTL = 86400; // 24 hours

// Zip code centroids for deriving zip from lat/lng
var ZIP_CENTROIDS = {
  '28202': { lat: 35.2271, lng: -80.8431 },
  '28203': { lat: 35.2118, lng: -80.8587 },
  '28204': { lat: 35.2177, lng: -80.8247 },
  '28205': { lat: 35.2283, lng: -80.7971 },
  '28206': { lat: 35.2620, lng: -80.8107 },
  '28207': { lat: 35.2050, lng: -80.8190 },
  '28208': { lat: 35.2230, lng: -80.9080 },
  '28209': { lat: 35.1810, lng: -80.8530 },
  '28210': { lat: 35.1510, lng: -80.8770 },
  '28211': { lat: 35.1800, lng: -80.8080 },
  '28212': { lat: 35.1780, lng: -80.7450 },
  '28213': { lat: 35.2870, lng: -80.7470 },
  '28214': { lat: 35.2600, lng: -80.9540 },
  '28215': { lat: 35.2490, lng: -80.7280 },
  '28216': { lat: 35.3100, lng: -80.8870 },
  '28217': { lat: 35.1700, lng: -80.9180 },
  '28226': { lat: 35.1180, lng: -80.8100 },
  '28227': { lat: 35.1610, lng: -80.6960 },
  '28262': { lat: 35.3370, lng: -80.7440 },
  '28269': { lat: 35.3420, lng: -80.8380 },
  '28270': { lat: 35.1130, lng: -80.7620 },
  '28273': { lat: 35.1210, lng: -80.9510 },
  '28277': { lat: 35.0590, lng: -80.8470 },
  '28278': { lat: 35.1010, lng: -80.9710 }
};

// Price estimation from Google price_level
var PRICE_ESTIMATES = {
  1: { haircut: 18, beard: 10, students: 15, hotTowel: null, lineup: 10, tier: 'Value' },
  2: { haircut: 30, beard: 18, students: 22, hotTowel: 25, lineup: 15, tier: 'Mid-tier' },
  3: { haircut: 48, beard: 28, students: 35, hotTowel: 40, lineup: 25, tier: 'Premium' },
  4: { haircut: 65, beard: 40, students: 45, hotTowel: 55, lineup: 35, tier: 'Premium' }
};

// Known booking platforms to detect
var BOOKING_PLATFORMS = [
  { name: 'Booksy', pattern: /booksy\.com/i },
  { name: 'Vagaro', pattern: /vagaro\.com/i },
  { name: 'Square Appointments', pattern: /squareup\.com|square\.site/i },
  { name: 'Schedulicity', pattern: /schedulicity\.com/i },
  { name: 'Squire', pattern: /getsquire\.com/i },
  { name: 'Fresha', pattern: /fresha\.com/i },
  { name: 'StyleSeat', pattern: /styleseat\.com/i },
  { name: 'Genbook', pattern: /genbook\.com/i }
];

function deriveZip(lat, lng) {
  if (!lat || !lng) return null;
  var closest = null;
  var minDist = Infinity;
  var zips = Object.keys(ZIP_CENTROIDS);
  for (var i = 0; i < zips.length; i++) {
    var c = ZIP_CENTROIDS[zips[i]];
    var d = Math.pow(lat - c.lat, 2) + Math.pow(lng - c.lng, 2);
    if (d < minDist) {
      minDist = d;
      closest = zips[i];
    }
  }
  return closest;
}

function detectBookingPlatform(website) {
  if (!website) return null;
  for (var i = 0; i < BOOKING_PLATFORMS.length; i++) {
    if (BOOKING_PLATFORMS[i].pattern.test(website)) {
      return { platform: BOOKING_PLATFORMS[i].name, url: website };
    }
  }
  return null;
}

// Attempt to scrape service menu from a booking page (best-effort)
async function scrapeBookingPage(url) {
  try {
    var resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; REUPBot/1.0)' },
      redirect: 'follow'
    });
    if (!resp.ok) return null;
    var html = await resp.text();

    var services = [];
    var barberCount = 0;
    var specialties = [];

    // Try to extract prices: look for patterns like "$25" or "$30.00" near service keywords
    // Each service has two patterns: service name followed by price, and price followed by service name
    var servicePatterns = [
      { name: "Men's Haircut", regex: /(?:men'?s?\s*(?:hair)?cut|regular\s*cut|classic\s*cut|haircut)[^$\d]*?\$(\d+(?:\.\d{2})?)/gi },
      { name: "Men's Haircut", regex: /\$(\d+(?:\.\d{2})?)[^a-z]*?(?:men'?s?\s*(?:hair)?cut|regular\s*cut|classic\s*cut|haircut)/gi },
      { name: 'Beard Trim', regex: /(?:beard\s*(?:trim|line|shape|groom))[^$\d]*?\$(\d+(?:\.\d{2})?)/gi },
      { name: 'Beard Trim', regex: /\$(\d+(?:\.\d{2})?)[^a-z]*?(?:beard\s*(?:trim|line|shape|groom))/gi },
      { name: 'Kids Cut', regex: /(?:kid'?s?\s*cut|child(?:ren)?'?s?\s*cut|youth\s*cut|boy'?s?\s*cut)[^$\d]*?\$(\d+(?:\.\d{2})?)/gi },
      { name: 'Lineup', regex: /(?:line\s*-?\s*up|edge\s*-?\s*up|shape\s*-?\s*up)[^$\d]*?\$(\d+(?:\.\d{2})?)/gi },
      { name: 'Hot Towel Shave', regex: /(?:hot\s*towel|straight\s*razor|razor\s*shave)[^$\d]*?\$(\d+(?:\.\d{2})?)/gi },
      { name: 'Haircut + Beard', regex: /(?:cut\s*(?:&|and|\+)\s*beard|haircut\s*(?:&|and|\+)\s*beard)[^$\d]*?\$(\d+(?:\.\d{2})?)/gi }
    ];

    servicePatterns.forEach(function(sp) {
      var match;
      while ((match = sp.regex.exec(html)) !== null) {
        var price = parseFloat(match[1]);
        if (price > 5 && price < 200) { // sanity check
          var exists = services.some(function(s) { return s.name === sp.name; });
          if (!exists) {
            services.push({ name: sp.name, price: price });
            break;
          }
        }
      }
    });

    // Try to count staff/barbers: look for repeated name patterns or team member counts
    var staffMatch = html.match(/(\d+)\s*(?:barber|stylist|staff|team\s*member|professional)/i);
    if (staffMatch) barberCount = parseInt(staffMatch[1]);

    // Alternative: count individual barber/stylist profile blocks
    if (!barberCount) {
      var profileMatches = html.match(/class="[^"]*(?:team-member|staff-member|barber-card|professional-card)[^"]*"/gi);
      if (profileMatches) barberCount = profileMatches.length;
    }

    // Look for specialties
    var specPatterns = /(?:specializ|expert|focus)[^.]*(?:fade|taper|razor|beard|texture|natural|loc|dread|braid|color)/gi;
    var specMatches = html.match(specPatterns);
    if (specMatches) {
      specMatches.forEach(function(m) {
        var keywords = m.match(/(?:fade|taper|razor|beard|texture|natural|loc|dread|braid|color)/gi);
        if (keywords) {
          keywords.forEach(function(k) {
            var cap = k.charAt(0).toUpperCase() + k.slice(1).toLowerCase();
            if (specialties.indexOf(cap) === -1) specialties.push(cap);
          });
        }
      });
    }

    if (services.length === 0 && barberCount === 0 && specialties.length === 0) return null;

    return {
      services: services,
      barber_count: barberCount || null,
      specialties: specialties
    };
  } catch (e) {
    return null;
  }
}

// Fetch Place Details for enrichment (phone, website, hours, photos, full address)
async function fetchPlaceDetails(placeId, apiKey) {
  try {
    var fields = 'place_id,name,formatted_address,formatted_phone_number,website,opening_hours,price_level,photos,user_ratings_total';
    var endpoint = 'https://maps.googleapis.com/maps/api/place/details/json' +
      '?place_id=' + encodeURIComponent(placeId) +
      '&fields=' + fields +
      '&key=' + apiKey;
    var resp = await fetch(endpoint);
    var data = await resp.json();
    if (data.status !== 'OK' || !data.result) return null;
    var r = data.result;
    return {
      full_address: r.formatted_address || null,
      phone: r.formatted_phone_number || null,
      website: r.website || null,
      price_level: r.price_level || null,
      hours: r.opening_hours ? {
        open_now: r.opening_hours.open_now || false,
        weekday_text: r.opening_hours.weekday_text || []
      } : null,
      photos: (r.photos || []).slice(0, 4).map(function(p) {
        return { reference: p.photo_reference, width: p.width, height: p.height };
      })
    };
  } catch (e) {
    return null;
  }
}

async function handleCharlotteShops(apiKey, request, ctx) {
  // Try cache first
  var cache = caches.default;
  var cacheKey = new Request(CACHE_KEY_URL, { method: 'GET' });
  var cached = await cache.match(cacheKey);
  if (cached) {
    var cachedData = await cached.json();
    cachedData.cached = true;
    return jsonResponse(cachedData, 200, request);
  }

  // Phase 1: Sweep all search points for basic data
  var allResults = [];
  var seen = {};
  var errors = 0;

  for (var i = 0; i < CLT_SEARCH_POINTS.length; i += 6) {
    var batch = CLT_SEARCH_POINTS.slice(i, i + 6);
    var batchPromises = batch.map(function(point) {
      var endpoint = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json' +
        '?location=' + point.lat + ',' + point.lng +
        '&radius=8000' +
        '&type=barber_shop' +
        '&keyword=barbershop' +
        '&key=' + apiKey;
      return fetch(endpoint).then(function(r) { return r.json(); }).catch(function() { return { results: [] }; });
    });

    var batchResults = await Promise.all(batchPromises);
    batchResults.forEach(function(data) {
      if (data.status === 'OK' || data.status === 'ZERO_RESULTS') {
        (data.results || []).forEach(function(place) {
          if (!seen[place.place_id]) {
            seen[place.place_id] = true;
            allResults.push(normalizePlace(place));
          }
        });
      } else {
        errors++;
      }
    });
  }

  // Phase 2: Enrich with Place Details (batch of 8 at a time, cap at 150)
  var toEnrich = allResults.slice(0, 150);
  for (var d = 0; d < toEnrich.length; d += 8) {
    var detailBatch = toEnrich.slice(d, d + 8);
    var detailPromises = detailBatch.map(function(shop) {
      return fetchPlaceDetails(shop.place_id, apiKey);
    });
    var details = await Promise.all(detailPromises);
    details.forEach(function(detail, idx) {
      if (detail) {
        var shop = toEnrich[d + idx];
        shop.full_address = detail.full_address;
        shop.phone = detail.phone;
        shop.website = detail.website;
        shop.hours = detail.hours;
        shop.photos = detail.photos;
        if (detail.price_level && !shop.price_level) {
          shop.price_level = detail.price_level;
        }
      }
    });
  }

  // Phase 3: Derive zip codes and estimate pricing for all shops
  var bookingChecks = [];
  allResults.forEach(function(shop) {
    // Derive zip from coordinates
    shop.derived_zip = deriveZip(shop.lat, shop.lng);

    // Estimate pricing from price_level
    var est = shop.price_level ? PRICE_ESTIMATES[shop.price_level] : null;
    shop.estimated_haircut = est ? est.haircut : null;
    shop.estimated_beard = est ? est.beard : null;
    shop.estimated_students = est ? est.students : null;
    shop.estimated_hotTowel = est ? est.hotTowel : null;
    shop.estimated_lineup = est ? est.lineup : null;
    shop.estimated_tier = est ? est.tier : 'Mid-tier';
    shop.pricing_source = null; // will be set below
    shop.source_tag = 'google'; // always for Google shops

    // Estimate barber count from review count if not already set
    if (!shop.barber_count && shop.total_ratings) {
      if (shop.total_ratings > 100) shop.barber_count = 6;
      else if (shop.total_ratings > 50) shop.barber_count = 4;
      else if (shop.total_ratings > 20) shop.barber_count = 3;
      else shop.barber_count = 2;
      shop.barber_count_source = 'estimated';
    }

    // Detect booking platform
    var booking = detectBookingPlatform(shop.website);
    shop.booking_platform = booking;

    if (booking) {
      shop.pricing_source = 'estimated'; // will upgrade to 'booking' if scrape succeeds
      bookingChecks.push(shop);
    } else if (est) {
      shop.pricing_source = 'estimated';
    }
  });

  // Phase 4: Attempt to scrape booking pages for service menus (cap at 30)
  var toScrape = bookingChecks.slice(0, 30);
  for (var s = 0; s < toScrape.length; s += 6) {
    var scrapeBatch = toScrape.slice(s, s + 6);
    var scrapePromises = scrapeBatch.map(function(shop) {
      return scrapeBookingPage(shop.booking_platform.url);
    });
    var scrapeResults = await Promise.all(scrapePromises);
    scrapeResults.forEach(function(result, idx) {
      if (result) {
        var shop = toScrape[s + idx];
        shop.booking_data = result;
        shop.pricing_source = 'booking';

        // Override estimated pricing with actual booking data
        result.services.forEach(function(svc) {
          if (/men'?s?\s*(?:hair)?cut|regular\s*cut|classic\s*cut/i.test(svc.name)) {
            shop.estimated_haircut = svc.price;
          }
          if (/beard/i.test(svc.name)) {
            shop.estimated_beard = svc.price;
          }
        });

        // Use barber count from booking page
        if (result.barber_count) {
          shop.barber_count = result.barber_count;
        }
      }
    });
  }

  // Build aggregate stats for the frontend
  var totalBarbers = 0;
  var ratingSum = 0;
  var ratingCount = 0;
  var haircutSum = 0;
  var haircutCount = 0;
  var beardSum = 0;
  var beardCount = 0;

  allResults.forEach(function(shop) {
    if (shop.barber_count) totalBarbers += shop.barber_count;
    if (shop.rating) { ratingSum += shop.rating; ratingCount++; }
    if (shop.estimated_haircut) { haircutSum += shop.estimated_haircut; haircutCount++; }
    if (shop.estimated_beard) { beardSum += shop.estimated_beard; beardCount++; }
  });

  var responseData = {
    status: 'OK',
    results: allResults,
    total: allResults.length,
    search_points: CLT_SEARCH_POINTS.length,
    errors: errors,
    cached: false,
    cache_ttl: CACHE_TTL,
    stats: {
      total_shops: allResults.length,
      total_barbers: totalBarbers,
      avg_rating: ratingCount > 0 ? Math.round((ratingSum / ratingCount) * 10) / 10 : null,
      avg_haircut: haircutCount > 0 ? Math.round(haircutSum / haircutCount) : null,
      avg_beard: beardCount > 0 ? Math.round(beardSum / beardCount) : null,
      shops_with_pricing: haircutCount,
      shops_with_booking: bookingChecks.length
    }
  };

  // Cache the response for 24 hours
  var cacheResponse = new Response(JSON.stringify(responseData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=' + CACHE_TTL
    }
  });
  if (ctx && ctx.waitUntil) {
    ctx.waitUntil(cache.put(cacheKey, cacheResponse.clone()));
  }

  return jsonResponse(responseData, 200, request);
}

// ── Main router ────────────────────────────────────────────────
export async function handlePlaces(request, env, ctx) {
  var url = new URL(request.url);
  var path = url.pathname;

  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(request, 'GET, OPTIONS')
    });
  }

  // Only GET requests
  if (request.method !== 'GET') {
    return errorResponse('Method not allowed', 405, request);
  }

  // API key check
  var apiKey = env.GOOGLE_PLACES_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GOOGLE_PLACES_API_KEY_HERE') {
    return errorResponse('Google Places API is not configured', 503, request);
  }

  // Charlotte shops endpoint — no rate limiting (cached)
  if (path === '/api/places/charlotte-shops') {
    return handleCharlotteShops(apiKey, request, ctx);
  }

  // Rate limiting for other endpoints
  var ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (isRateLimited(ip)) {
    return errorResponse('Rate limit exceeded. Try again shortly.', 429, request);
  }

  // Route to handlers
  if (path === '/api/places/nearby') {
    return handleNearby(url, apiKey, request);
  }
  if (path === '/api/places/textsearch') {
    return handleTextSearch(url, apiKey, request);
  }
  if (path === '/api/places/autocomplete') {
    return handleAutocomplete(url, apiKey, request);
  }
  if (path === '/api/places/photo') {
    return handlePhoto(url, apiKey, request);
  }

  // /api/places/details/:placeId
  var detailsMatch = path.match(/^\/api\/places\/details\/(.+)$/);
  if (detailsMatch) {
    return handleDetails(decodeURIComponent(detailsMatch[1]), apiKey, request);
  }

  return errorResponse('Unknown places endpoint', 404, request);
}
