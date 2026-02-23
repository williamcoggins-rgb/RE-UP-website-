var express = require('express');
var bcrypt = require('bcryptjs');
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Simple file-based user store (works in Vercel's /tmp) ---
// In production, replace with a proper database (Vercel Postgres, PlanetScale, etc.)
var DATA_DIR = '/tmp/reup-data';

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getUsers() {
  ensureDataDir();
  var filePath = path.join(DATA_DIR, 'users.json');
  if (!fs.existsSync(filePath)) return [];
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch(e) { return []; }
}

function saveUsers(users) {
  ensureDataDir();
  fs.writeFileSync(path.join(DATA_DIR, 'users.json'), JSON.stringify(users));
}

// --- Session tokens (stored in /tmp — ephemeral but functional) ---
function getSessions() {
  ensureDataDir();
  var filePath = path.join(DATA_DIR, 'sessions.json');
  if (!fs.existsSync(filePath)) return {};
  try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch(e) { return {}; }
}

function saveSessions(sessions) {
  ensureDataDir();
  fs.writeFileSync(path.join(DATA_DIR, 'sessions.json'), JSON.stringify(sessions));
}

function createSession(user) {
  var token = crypto.randomBytes(32).toString('hex');
  var sessions = getSessions();
  sessions[token] = { id: user.id, email: user.email, name: user.name, created: Date.now() };
  saveSessions(sessions);
  return token;
}

function getSessionUser(req) {
  var cookie = req.headers.cookie || '';
  var match = cookie.match(/reup_session=([^;]+)/);
  if (!match) return null;
  var sessions = getSessions();
  return sessions[match[1]] || null;
}

var COOKIE_OPTS = '; Path=/; HttpOnly; SameSite=Lax; Max-Age=' + (30 * 24 * 60 * 60);

// --- Auth API Routes ---

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

  var users = getUsers();
  var existing = users.find(function(u) { return u.email === email; });
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  var hash = bcrypt.hashSync(password, 12);
  var user = { id: Date.now(), email: email, password: hash, name: name };
  users.push(user);
  saveUsers(users);

  var token = createSession(user);
  res.setHeader('Set-Cookie', 'reup_session=' + token + COOKIE_OPTS);
  res.json({ ok: true, user: { email: email, name: name } });
});

// Login
app.post('/api/login', function(req, res) {
  var email = (req.body.email || '').trim().toLowerCase();
  var password = req.body.password || '';

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  var users = getUsers();
  var user = users.find(function(u) { return u.email === email; });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  var token = createSession(user);
  res.setHeader('Set-Cookie', 'reup_session=' + token + COOKIE_OPTS);
  res.json({ ok: true, user: { email: user.email, name: user.name } });
});

// Logout
app.post('/api/logout', function(req, res) {
  var cookie = req.headers.cookie || '';
  var match = cookie.match(/reup_session=([^;]+)/);
  if (match) {
    var sessions = getSessions();
    delete sessions[match[1]];
    saveSessions(sessions);
  }
  res.setHeader('Set-Cookie', 'reup_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
  res.json({ ok: true });
});

// Get current user
app.get('/api/me', function(req, res) {
  var user = getSessionUser(req);
  if (user) {
    res.json({ user: { id: user.id, email: user.email, name: user.name } });
  } else {
    res.json({ user: null });
  }
});

module.exports = app;
