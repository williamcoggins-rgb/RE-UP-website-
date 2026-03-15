// In-memory session token store (per worker instance)
const validTokens = new Set();

// Rate limiting: track login attempts per IP
// Map<IP, { count: number, resetAt: number }>
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const ALLOWED_ORIGINS = [
  'https://reupreport.com',
  'https://www.reupreport.com'
];

function getAllowedOrigin(request) {
  const origin = request.headers.get('Origin') || '';
  // Allow known origins
  if (ALLOWED_ORIGINS.includes(origin)) {
    return origin;
  }
  // Allow same-origin requests (workers.dev, custom domains, etc.)
  const requestUrl = new URL(request.url);
  if (origin === requestUrl.origin) {
    return origin;
  }
  // Allow requests with no Origin header (same-origin navigations)
  if (!origin) {
    return requestUrl.origin;
  }
  return null;
}

function corsHeaders(request) {
  const origin = getAllowedOrigin(request);
  return {
    'Access-Control-Allow-Origin': origin || '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

function isRateLimited(ip) {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  if (entry.count > MAX_ATTEMPTS) {
    return true;
  }
  return false;
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
}

export function validateToken(token) {
  return validTokens.has(token);
}

export async function onRequestPost(context) {
  const origin = getAllowedOrigin(context.request);
  const headers = {
    'Content-Type': 'application/json',
    ...corsHeaders(context.request)
  };

  // Block requests from disallowed origins
  if (!origin) {
    return new Response(JSON.stringify({ success: false, error: 'Forbidden' }), {
      status: 403,
      headers: headers
    });
  }

  // Rate limiting by IP
  const ip = context.request.headers.get('CF-Connecting-IP') ||
             context.request.headers.get('X-Forwarded-For') ||
             'unknown';

  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ success: false, error: 'Too many login attempts. Try again later.' }), {
      status: 429,
      headers: headers
    });
  }

  // Parse request body
  var body;
  try {
    body = await context.request.json();
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: 'Invalid request' }), {
      status: 400,
      headers: headers
    });
  }

  var password = body.password;
  if (!password || typeof password !== 'string') {
    return new Response(JSON.stringify({ success: false, error: 'Password is required' }), {
      status: 400,
      headers: headers
    });
  }

  // Hash the submitted password and compare to stored hash
  var expectedHash = context.env.DASHBOARD_PASSWORD_HASH;
  if (!expectedHash) {
    return new Response(JSON.stringify({ success: false, error: 'Server configuration error' }), {
      status: 500,
      headers: headers
    });
  }

  var submittedHash = await hashPassword(password);

  if (submittedHash !== expectedHash.toLowerCase()) {
    return new Response(JSON.stringify({ success: false, error: 'Invalid password' }), {
      status: 401,
      headers: headers
    });
  }

  // Generate session token and store it
  var token = crypto.randomUUID();
  validTokens.add(token);

  return new Response(JSON.stringify({ success: true, token: token }), {
    status: 200,
    headers: headers
  });
}

export async function onRequestOptions(context) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(context.request)
  });
}
