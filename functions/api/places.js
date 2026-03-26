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

var CACHE_KEY_URL = 'https://reup-internal-cache.reupreport.com/charlotte-shops-v1';
var CACHE_TTL = 86400; // 24 hours

async function handleCharlotteShops(apiKey, request, ctx) {
  // Try cache first
  var cache = caches.default;
  var cacheKey = new Request(CACHE_KEY_URL, { method: 'GET' });
  var cached = await cache.match(cacheKey);
  if (cached) {
    // Clone and add CORS headers for this specific request
    var cachedData = await cached.json();
    return jsonResponse(cachedData, 200, request);
  }

  // Sweep all search points — 8km radius each for overlap
  var allResults = [];
  var seen = {};
  var errors = 0;

  // Run searches in batches of 6 to avoid overwhelming Google
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

  var responseData = {
    status: 'OK',
    results: allResults,
    total: allResults.length,
    search_points: CLT_SEARCH_POINTS.length,
    errors: errors,
    cached: false,
    cache_ttl: CACHE_TTL
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

  // Return with CORS
  responseData.cached = false;
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
