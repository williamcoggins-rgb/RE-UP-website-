var ALLOWED_ORIGINS = ['https://reupreport.com', 'https://www.reupreport.com'];

function getAllowedOrigin(request) {
  var origin = request.headers.get('Origin');
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return origin;
  }
  return null;
}

function corsHeaders(request) {
  var origin = getAllowedOrigin(request);
  var headers = { 'Content-Type': 'application/json' };
  if (origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Vary'] = 'Origin';
  }
  return headers;
}

// In-memory rate limiter: IP -> [timestamps]
var rateLimitMap = new Map();
var RATE_LIMIT_MAX = 5;
var RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(request) {
  var ip = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || 'unknown';
  var now = Date.now();

  // Clean up old entries across the map
  for (var [key, timestamps] of rateLimitMap) {
    var filtered = timestamps.filter(function (t) { return now - t < RATE_LIMIT_WINDOW_MS; });
    if (filtered.length === 0) {
      rateLimitMap.delete(key);
    } else {
      rateLimitMap.set(key, filtered);
    }
  }

  var timestamps = rateLimitMap.get(ip) || [];
  // Filter to current window
  timestamps = timestamps.filter(function (t) { return now - t < RATE_LIMIT_WINDOW_MS; });

  if (timestamps.length >= RATE_LIMIT_MAX) {
    return false;
  }

  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return true;
}

function checkCsrf(request) {
  var origin = request.headers.get('Origin');
  var referer = request.headers.get('Referer');

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return true;
  }

  if (referer) {
    for (var i = 0; i < ALLOWED_ORIGINS.length; i++) {
      if (referer.startsWith(ALLOWED_ORIGINS[i])) {
        return true;
      }
    }
  }

  return false;
}

export async function onRequestPost(context) {
  var headers = corsHeaders(context.request);

  // CSRF protection
  if (!checkCsrf(context.request)) {
    return new Response(JSON.stringify({ success: false, error: 'Forbidden' }), { status: 403, headers: headers });
  }

  // Rate limiting
  if (!checkRateLimit(context.request)) {
    return new Response(JSON.stringify({ success: false, error: 'Too many requests. Please try again later.' }), { status: 429, headers: headers });
  }

  try {
    var body = await context.request.json();
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: 'Invalid request' }), { status: 400, headers: headers });
  }

  // Verify Cloudflare Turnstile token
  var turnstileSecret = context.env.TURNSTILE_SECRET_KEY;
  var turnstileToken = body.token || '';

  if (turnstileSecret) {
    if (!turnstileToken) {
      return new Response(JSON.stringify({ success: false, error: 'CAPTCHA verification required' }), { status: 400, headers: headers });
    }

    var ip = context.request.headers.get('CF-Connecting-IP') || '';
    var turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: turnstileSecret,
        response: turnstileToken,
        remoteip: ip
      })
    });

    var turnstileData = await turnstileRes.json();
    if (!turnstileData.success) {
      return new Response(JSON.stringify({ success: false, error: 'CAPTCHA verification failed' }), { status: 403, headers: headers });
    }
  }

  var name = (body.name || '').trim().slice(0, 100);
  var email = (body.email || '').trim().toLowerCase().slice(0, 255);
  var phone = (body.phone || '').trim().slice(0, 20);
  var zip = (body.zip || '').trim().slice(0, 5);

  if (!name) return new Response(JSON.stringify({ success: false, error: 'Name is required' }), { status: 400, headers: headers });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return new Response(JSON.stringify({ success: false, error: 'Valid email is required' }), { status: 400, headers: headers });
  if (!zip || !/^[0-9]{5}$/.test(zip)) return new Response(JSON.stringify({ success: false, error: 'Valid 5-digit zip is required' }), { status: 400, headers: headers });

  // Send welcome email via Resend
  var apiKey = context.env.RESEND_API_KEY;
  var fromEmail = context.env.FROM_EMAIL || 'RE UP Report <hello@reupreport.com>';
  var emailSent = false;

  if (!apiKey) {
    return new Response(JSON.stringify({ success: false, error: 'Email service not configured' }), { status: 500, headers: headers });
  }

  var firstName = name.split(' ')[0];
  try {
    var emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: email,
        subject: "You're on the list \u2014 RE UP Report is coming",
        html:
          '<div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;max-width:560px;margin:0 auto;padding:40px 20px;color:#ccc;background:#0a0a0a;">' +
            '<div style="text-align:center;margin-bottom:32px;">' +
              '<span style="font-size:24px;font-weight:700;color:#fff;letter-spacing:-0.02em;">RE UP <span style="color:#e50914;">REPORT</span></span>' +
            '</div>' +
            '<h1 style="color:#fff;font-size:22px;margin-bottom:8px;">Welcome, ' + firstName + '.</h1>' +
            '<p style="font-size:15px;line-height:1.7;color:#aaa;">You just secured early access to the only market intelligence platform built for barbers who run their chair like a business.</p>' +
            '<div style="background:#141414;border:1px solid #2a2a2a;border-radius:8px;padding:20px;margin:24px 0;">' +
              '<p style="color:#fff;font-weight:600;margin-bottom:12px;">Here\'s what you\'ll get access to:</p>' +
              '<ul style="list-style:none;padding:0;margin:0;color:#aaa;font-size:14px;line-height:2;">' +
                '<li>\u2713 &nbsp;Real-time pricing data across 47+ Charlotte barbershops</li>' +
                '<li>\u2713 &nbsp;Competitor tracking \u2014 see who\'s moving and how</li>' +
                '<li>\u2713 &nbsp;Trend analysis so you price with confidence</li>' +
                '<li>\u2713 &nbsp;Weekly market intelligence delivered to your inbox</li>' +
                '<li>\u2713 &nbsp;Original reporting on the Charlotte barber scene</li>' +
              '</ul>' +
            '</div>' +
            '<p style="font-size:15px;line-height:1.7;color:#aaa;">We\'re putting the finishing touches on the platform now. When we go live, you\'ll be the first to know.</p>' +
            '<p style="font-size:15px;line-height:1.7;color:#aaa;">Your zip code: <strong style="color:#fff;">' + (zip || '\u2014') + '</strong> \u2014 we\'ll make sure your local data is dialed in.</p>' +
            '<div style="margin-top:32px;padding-top:20px;border-top:1px solid #1e1e1e;font-size:12px;color:#666;text-align:center;">' +
              '<p>RE UP Report \u2014 Barbershop Market Intelligence</p>' +
              '<p>Charlotte, NC</p>' +
            '</div>' +
          '</div>'
      })
    });

    if (!emailRes.ok) {
      return new Response(JSON.stringify({ success: false, error: 'Email service error' }), { status: 500, headers: headers });
    }
    emailSent = true;
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: 'Email send failed' }), { status: 500, headers: headers });
  }

  return new Response(JSON.stringify({ success: true, message: 'added', emailSent: emailSent }), { status: 201, headers: headers });
}

export async function onRequestOptions(context) {
  var origin = getAllowedOrigin(context.request);
  var headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  if (origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Vary'] = 'Origin';
  }
  return new Response(null, { headers: headers });
}
