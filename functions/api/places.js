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

// ── Main router ────────────────────────────────────────────────
export async function handlePlaces(request, env) {
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

  // Rate limiting
  var ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (isRateLimited(ip)) {
    return errorResponse('Rate limit exceeded. Try again shortly.', 429, request);
  }

  // API key check
  var apiKey = env.GOOGLE_PLACES_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GOOGLE_PLACES_API_KEY_HERE') {
    return errorResponse('Google Places API is not configured', 503, request);
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
