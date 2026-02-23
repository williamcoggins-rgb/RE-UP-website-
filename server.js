var express = require('express');
var session = require('express-session');
var Database = require('better-sqlite3');
var bcrypt = require('bcryptjs');
var path = require('path');
var fs = require('fs');

var app = express();
var PORT = process.env.PORT || 3000;

// --- Database setup ---
var dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

var db = new Database(path.join(dataDir, 'reup.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    membership_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'reup-dev-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// Make auth state available to every request
app.use(function(req, res, next) {
  res.locals.user = req.session.user || null;
  next();
});

// --- Auth API routes ---

// Signup
app.post('/api/signup', function(req, res) {
  var email = (req.body.email || '').trim().toLowerCase();
  var password = req.body.password || '';
  var name = (req.body.name || '').trim();

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  // Check if user exists
  var existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  var hash = bcrypt.hashSync(password, 12);
  var result = db.prepare('INSERT INTO users (email, password, name) VALUES (?, ?, ?)').run(email, hash, name);

  req.session.user = { id: result.lastInsertRowid, email: email, name: name };
  res.json({ ok: true, user: { email: email, name: name } });
});

// Login
app.post('/api/login', function(req, res) {
  var email = (req.body.email || '').trim().toLowerCase();
  var password = req.body.password || '';

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  var user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  if (!user.membership_active) {
    return res.status(403).json({ error: 'Your membership is inactive. Please renew to access courses.' });
  }

  req.session.user = { id: user.id, email: user.email, name: user.name };
  res.json({ ok: true, user: { email: user.email, name: user.name } });
});

// Logout
app.post('/api/logout', function(req, res) {
  req.session.destroy(function() {
    res.json({ ok: true });
  });
});

// Get current user
app.get('/api/me', function(req, res) {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.json({ user: null });
  }
});

// --- Protected page middleware ---
function requireAuth(req, res, next) {
  if (req.session.user) {
    return next();
  }
  // Redirect to login with return URL
  res.redirect('/pages/login.html?redirect=' + encodeURIComponent(req.originalUrl));
}

// Gate the courses page
app.get('/pages/courses.html', requireAuth, function(req, res) {
  res.sendFile(path.join(__dirname, 'pages', 'courses.html'));
});

// --- Static files (after auth routes so gating works) ---
app.use(express.static(__dirname));

// --- Start ---
app.listen(PORT, function() {
  console.log('RE UP running on http://localhost:' + PORT);
});
