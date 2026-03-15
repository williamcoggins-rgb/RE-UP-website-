var express = require('express');
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');
var { Resend } = require('resend');

// --- Email ---
var resend = new Resend(process.env.RESEND_API_KEY || '');
var FROM_EMAIL = process.env.FROM_EMAIL || 'RE UP Report <onboarding@resend.dev>';

var app = express();
var PORT = process.env.PORT || 3000;

// --- Authentication ---
var ADMIN_PASSWORD = process.env.REUP_ADMIN_PASSWORD || 'Sanford8715!';
var SESSION_TTL = 24 * 60 * 60 * 1000; // 24 hours
var sessions = {}; // token -> { createdAt: timestamp }

// Clean up expired sessions every hour
setInterval(function () {
  var now = Date.now();
  Object.keys(sessions).forEach(function (token) {
    if (now - sessions[token].createdAt > SESSION_TTL) {
      delete sessions[token];
    }
  });
}, 60 * 60 * 1000);

// --- Middleware (must come before route handlers) ---
app.use(express.json());

// CORS headers for local development
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// --- Auth endpoints ---

app.post('/api/auth/login', function (req, res) {
  var password = req.body && req.body.password;
  if (!password || password !== ADMIN_PASSWORD) {
    return res.json({ success: false });
  }
  var token = crypto.randomBytes(32).toString('hex');
  sessions[token] = { createdAt: Date.now() };
  res.json({ success: true, token: token });
});

app.get('/api/auth/verify', function (req, res) {
  var auth = req.headers.authorization || '';
  var token = auth.replace(/^Bearer\s+/i, '');
  if (!token || !sessions[token]) {
    return res.json({ valid: false });
  }
  if (Date.now() - sessions[token].createdAt > SESSION_TTL) {
    delete sessions[token];
    return res.json({ valid: false });
  }
  res.json({ valid: true });
});

app.post('/api/auth/logout', function (req, res) {
  var auth = req.headers.authorization || '';
  var token = auth.replace(/^Bearer\s+/i, '');
  if (token && sessions[token]) {
    delete sessions[token];
  }
  res.json({ success: true });
});

// --- In-memory cache for JSON data files ---
var dataCache = {};

function loadDataFile(filename) {
  if (dataCache[filename]) {
    return dataCache[filename];
  }

  var filePath = path.join(__dirname, 'data', 'exports', filename);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  var raw = fs.readFileSync(filePath, 'utf8');
  var parsed = JSON.parse(raw);
  dataCache[filename] = parsed;
  return parsed;
}

// --- Market Data API routes ---

var dataRoutes = {
  '/api/market/summary':      'market_summary.json',
  '/api/market/competitors':   'competitors.json',
  '/api/market/pricing':       'pricing.json',
  '/api/market/price-history': 'price_history.json',
  '/api/market/barbers':       'barbers.json',
  '/api/market/social':        'social.json',
  '/api/market/reviews':       'reviews.json',
  '/api/market/moves':         'competitor_moves.json',
  '/api/market/rnd':           'rnd_projects.json',
  '/api/newsroom':             'newsroom.json'
};

Object.keys(dataRoutes).forEach(function(route) {
  var filename = dataRoutes[route];

  app.get(route, function(req, res) {
    try {
      var data = loadDataFile(filename);
      if (data === null) {
        return res.status(404).json({ error: 'Data not available' });
      }
      res.json(data);
    } catch(e) {
      return res.status(500).json({ error: 'Failed to load data' });
    }
  });
});

// --- Waitlist signup + welcome email ---
var WAITLIST_FILE = path.join(__dirname, 'data', 'waitlist.json');

function loadWaitlist() {
  try {
    if (fs.existsSync(WAITLIST_FILE)) {
      return JSON.parse(fs.readFileSync(WAITLIST_FILE, 'utf8'));
    }
  } catch (e) { /* corrupted file — start fresh */ }
  return [];
}

function saveWaitlist(list) {
  var dir = path.dirname(WAITLIST_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(WAITLIST_FILE, JSON.stringify(list, null, 2));
}

function sendWelcomeEmail(entry) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping welcome email for', entry.email);
    return Promise.resolve();
  }

  var firstName = entry.name.split(' ')[0];

  return resend.emails.send({
    from: FROM_EMAIL,
    to: entry.email,
    subject: "You're on the list — RE UP Report is coming",
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
            '<li>\u2713 &nbsp;Competitor tracking — see who\'s moving and how</li>' +
            '<li>\u2713 &nbsp;Trend analysis so you price with confidence</li>' +
            '<li>\u2713 &nbsp;Weekly market intelligence delivered to your inbox</li>' +
            '<li>\u2713 &nbsp;Original reporting on the Charlotte barber scene</li>' +
          '</ul>' +
        '</div>' +
        '<p style="font-size:15px;line-height:1.7;color:#aaa;">We\'re putting the finishing touches on the platform now. When we go live, you\'ll be the first to know.</p>' +
        '<p style="font-size:15px;line-height:1.7;color:#aaa;">Your zip code: <strong style="color:#fff;">' + (entry.zip || '—') + '</strong> — we\'ll make sure your local data is dialed in.</p>' +
        '<div style="margin-top:32px;padding-top:20px;border-top:1px solid #1e1e1e;font-size:12px;color:#666;text-align:center;">' +
          '<p>RE UP Report — Barbershop Market Intelligence</p>' +
          '<p>Charlotte, NC</p>' +
        '</div>' +
      '</div>'
  }).catch(function (err) {
    console.error('Failed to send welcome email to', entry.email, err.message);
  });
}

app.post('/api/waitlist', function (req, res) {
  var name = (req.body.name || '').trim().slice(0, 100);
  var email = (req.body.email || '').trim().toLowerCase().slice(0, 255);
  var phone = (req.body.phone || '').trim().slice(0, 20);
  var zip = (req.body.zip || '').trim().slice(0, 5);

  // Validate
  if (!name) return res.status(400).json({ success: false, error: 'Name is required' });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ success: false, error: 'Valid email is required' });
  if (!zip || !/^[0-9]{5}$/.test(zip)) return res.status(400).json({ success: false, error: 'Valid 5-digit zip is required' });

  var list = loadWaitlist();

  // Check for duplicate
  var exists = list.some(function (e) { return e.email === email; });
  if (exists) {
    return res.json({ success: true, message: 'already_on_list' });
  }

  var entry = { name: name, email: email, phone: phone, zip: zip, date: new Date().toISOString() };
  list.push(entry);
  saveWaitlist(list);

  // Send welcome email (don't block the response)
  sendWelcomeEmail(entry);

  res.status(201).json({ success: true, message: 'added' });
});

// --- Static files ---
app.use(express.static(__dirname));

// --- Start (local dev) / Export (Railway / Vercel) ---
if (require.main === module) {
  app.listen(PORT, function() {
    console.log('RE UP Report running on http://localhost:' + PORT);
  });
}

module.exports = app;
