var express = require('express');
var path = require('path');
var fs = require('fs');

var app = express();
var PORT = process.env.PORT || 3000;

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

// --- Middleware ---
app.use(express.json());

// CORS headers for local development
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

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
