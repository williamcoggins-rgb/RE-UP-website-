var express = require('express');
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');

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

// --- Static files ---
app.use(express.static(__dirname));

// --- Start (local dev) / Export (Vercel) ---
if (require.main === module) {
  app.listen(PORT, function() {
    console.log('RE UP Report running on http://localhost:' + PORT);
  });
}

module.exports = app;
