require('dotenv').config();

var express = require('express');
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var helmet = require('helmet');
var rateLimit = require('express-rate-limit');
var pool = require('./db/pool');

var app = express();
var PORT = process.env.PORT || 3000;

// --- Security config (from environment) ---
var JWT_SECRET = process.env.JWT_SECRET;
var BCRYPT_ROUNDS = 12;
var TOKEN_EXPIRY = '24h';

if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.error('FATAL: JWT_SECRET must be set in production');
  process.exit(1);
}
// Fallback for local dev only
if (!JWT_SECRET) {
  JWT_SECRET = crypto.randomBytes(64).toString('hex');
  console.warn('WARNING: Using random JWT_SECRET — tokens will not survive restarts');
}

// --- Security middleware ---
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"]
    }
  }
}));

app.use(express.json({ limit: '10kb' })); // prevent large payload attacks

// Rate limiting — general
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, try again later' }
}));

// Rate limiting — strict for auth endpoints
var authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, try again in 15 minutes' }
});

// CORS — locked down
var ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:' + PORT];

app.use(function (req, res, next) {
  var origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.indexOf(origin) !== -1) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// --- Input validation helpers ---
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 255;
}

function isValidPhone(phone) {
  if (!phone) return true; // optional
  return /^[\d\s\-\+\(\)]{7,20}$/.test(phone);
}

function sanitize(str, maxLength) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLength);
}

// --- JWT helpers ---
function signToken(userId, role) {
  return jwt.sign({ sub: userId, role: role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

// --- Auth middleware ---
function requireAuth(req, res, next) {
  var auth = req.headers.authorization || '';
  var token = auth.replace(/^Bearer\s+/i, '');
  var decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.userId = decoded.sub;
  req.userRole = decoded.role;
  next();
}

// ============================================================
// AUTH ENDPOINTS
// ============================================================

// --- Register ---
app.post('/api/auth/register', authLimiter, function (req, res) {
  var email = sanitize(req.body.email, 255).toLowerCase();
  var password = req.body.password || '';
  var firstName = sanitize(req.body.firstName, 100);
  var lastName = sanitize(req.body.lastName, 100);
  var phone = sanitize(req.body.phone, 20);
  var businessName = sanitize(req.body.businessName, 200);

  // Validation
  var errors = [];
  if (!isValidEmail(email)) errors.push('Valid email is required');
  if (password.length < 8) errors.push('Password must be at least 8 characters');
  if (password.length > 128) errors.push('Password is too long');
  if (!/[A-Z]/.test(password)) errors.push('Password must contain an uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Password must contain a lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('Password must contain a number');
  if (!firstName) errors.push('First name is required');
  if (!lastName) errors.push('Last name is required');
  if (!isValidPhone(phone)) errors.push('Invalid phone number format');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors: errors });
  }

  bcrypt.hash(password, BCRYPT_ROUNDS, function (err, hash) {
    if (err) {
      console.error('bcrypt error:', err.message);
      return res.status(500).json({ success: false, errors: ['Server error'] });
    }

    pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, phone, business_name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, role',
      [email, hash, firstName, lastName, phone || null, businessName || null],
      function (dbErr, result) {
        if (dbErr) {
          if (dbErr.code === '23505') { // unique violation
            return res.status(409).json({ success: false, errors: ['An account with this email already exists'] });
          }
          console.error('DB error:', dbErr.message);
          return res.status(500).json({ success: false, errors: ['Server error'] });
        }

        var user = result.rows[0];
        var token = signToken(user.id, user.role);
        res.status(201).json({ success: true, token: token });
      }
    );
  });
});

// --- Login ---
app.post('/api/auth/login', authLimiter, function (req, res) {
  var email = sanitize(req.body.email, 255).toLowerCase();
  var password = req.body.password || '';

  if (!email || !password) {
    return res.status(400).json({ success: false, errors: ['Email and password are required'] });
  }

  pool.query('SELECT id, password_hash, role FROM users WHERE email = $1', [email], function (err, result) {
    if (err) {
      console.error('DB error:', err.message);
      return res.status(500).json({ success: false, errors: ['Server error'] });
    }

    if (result.rows.length === 0) {
      // Use constant-time response to prevent user enumeration
      return res.status(401).json({ success: false, errors: ['Invalid email or password'] });
    }

    var user = result.rows[0];
    bcrypt.compare(password, user.password_hash, function (bcryptErr, match) {
      if (bcryptErr) {
        console.error('bcrypt error:', bcryptErr.message);
        return res.status(500).json({ success: false, errors: ['Server error'] });
      }

      if (!match) {
        return res.status(401).json({ success: false, errors: ['Invalid email or password'] });
      }

      var token = signToken(user.id, user.role);
      res.json({ success: true, token: token });
    });
  });
});

// --- Verify token ---
app.get('/api/auth/verify', function (req, res) {
  var auth = req.headers.authorization || '';
  var token = auth.replace(/^Bearer\s+/i, '');
  var decoded = verifyToken(token);
  res.json({ valid: !!decoded });
});

// --- Logout (client-side token discard — JWT is stateless) ---
app.post('/api/auth/logout', function (req, res) {
  res.json({ success: true });
});

// ============================================================
// USER PROFILE ENDPOINTS (protected)
// ============================================================

app.get('/api/user/profile', requireAuth, function (req, res) {
  pool.query(
    'SELECT id, email, first_name, last_name, phone, business_name, role, created_at FROM users WHERE id = $1',
    [req.userId],
    function (err, result) {
      if (err) {
        console.error('DB error:', err.message);
        return res.status(500).json({ error: 'Server error' });
      }
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      var user = result.rows[0];
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        businessName: user.business_name,
        role: user.role,
        createdAt: user.created_at
      });
    }
  );
});

app.put('/api/user/profile', requireAuth, function (req, res) {
  var firstName = sanitize(req.body.firstName, 100);
  var lastName = sanitize(req.body.lastName, 100);
  var phone = sanitize(req.body.phone, 20);
  var businessName = sanitize(req.body.businessName, 200);

  var errors = [];
  if (!firstName) errors.push('First name is required');
  if (!lastName) errors.push('Last name is required');
  if (!isValidPhone(phone)) errors.push('Invalid phone number format');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors: errors });
  }

  pool.query(
    'UPDATE users SET first_name = $1, last_name = $2, phone = $3, business_name = $4 WHERE id = $5 RETURNING id',
    [firstName, lastName, phone || null, businessName || null, req.userId],
    function (err, result) {
      if (err) {
        console.error('DB error:', err.message);
        return res.status(500).json({ success: false, errors: ['Server error'] });
      }
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, errors: ['User not found'] });
      }
      res.json({ success: true });
    }
  );
});

app.put('/api/user/password', requireAuth, function (req, res) {
  var currentPassword = req.body.currentPassword || '';
  var newPassword = req.body.newPassword || '';

  var errors = [];
  if (!currentPassword) errors.push('Current password is required');
  if (newPassword.length < 8) errors.push('New password must be at least 8 characters');
  if (newPassword.length > 128) errors.push('New password is too long');
  if (!/[A-Z]/.test(newPassword)) errors.push('New password must contain an uppercase letter');
  if (!/[a-z]/.test(newPassword)) errors.push('New password must contain a lowercase letter');
  if (!/[0-9]/.test(newPassword)) errors.push('New password must contain a number');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors: errors });
  }

  pool.query('SELECT password_hash FROM users WHERE id = $1', [req.userId], function (err, result) {
    if (err || result.rows.length === 0) {
      return res.status(500).json({ success: false, errors: ['Server error'] });
    }

    bcrypt.compare(currentPassword, result.rows[0].password_hash, function (bcryptErr, match) {
      if (bcryptErr || !match) {
        return res.status(401).json({ success: false, errors: ['Current password is incorrect'] });
      }

      bcrypt.hash(newPassword, BCRYPT_ROUNDS, function (hashErr, hash) {
        if (hashErr) {
          return res.status(500).json({ success: false, errors: ['Server error'] });
        }

        pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, req.userId], function (updateErr) {
          if (updateErr) {
            return res.status(500).json({ success: false, errors: ['Server error'] });
          }
          res.json({ success: true });
        });
      });
    });
  });
});

// ============================================================
// MARKET DATA API (unchanged — serves JSON files)
// ============================================================

var dataCache = {};

function loadDataFile(filename) {
  if (dataCache[filename]) return dataCache[filename];
  var filePath = path.join(__dirname, 'data', 'exports', filename);
  if (!fs.existsSync(filePath)) return null;
  var raw = fs.readFileSync(filePath, 'utf8');
  var parsed = JSON.parse(raw);
  dataCache[filename] = parsed;
  return parsed;
}

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

Object.keys(dataRoutes).forEach(function (route) {
  var filename = dataRoutes[route];
  app.get(route, function (req, res) {
    try {
      var data = loadDataFile(filename);
      if (data === null) return res.status(404).json({ error: 'Data not available' });
      res.json(data);
    } catch (e) {
      return res.status(500).json({ error: 'Failed to load data' });
    }
  });
});

// --- Static files ---
app.use(express.static(__dirname));

// --- Start / Export ---
if (require.main === module) {
  app.listen(PORT, function () {
    console.log('RE UP Report running on http://localhost:' + PORT);
  });
}

module.exports = app;
