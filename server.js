var express = require('express');
var session = require('express-session');
var Database = require('better-sqlite3');
var bcrypt = require('bcryptjs');
var path = require('path');
var fs = require('fs');
var https = require('https');

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

db.exec(`
  CREATE TABLE IF NOT EXISTS workbooks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course TEXT NOT NULL,
    data TEXT NOT NULL DEFAULT '{}',
    updated_at TEXT DEFAULT (datetime('now')),
    UNIQUE(user_id, course)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

// --- Course context for AI chat ---
var courseContext = {
  'price-your-chair': {
    name: 'Price Your Chair',
    systemPrompt: 'You are the RE UP course assistant for "Price Your Chair" — a course that teaches barbers how to price their services correctly. You are an expert in pricing strategy, market positioning, cost analysis, tiered pricing, value-based pricing, and the psychology of perceived value — all specifically for barbers and the barbering industry. Keep answers practical, actionable, and grounded in real barber business scenarios. Be encouraging but direct. Keep responses concise (2-4 paragraphs max unless the user asks for more detail).'
  },
  'wealth-of-barbers': {
    name: 'The Wealth of Barbers',
    systemPrompt: 'You are the RE UP course assistant for "The Wealth of Barbers" — the most comprehensive financial education course for barbers. You are an expert in P&L statements, tax strategy for self-employed barbers, saving systems, investing fundamentals, retirement accounts (SEP-IRA, Solo 401k), building wealth, business structures (sole prop, LLC, S-Corp), and financial planning — all specifically for barbers and the barbering industry. Keep answers practical, actionable, and grounded in real barber business scenarios. Be encouraging but direct. Keep responses concise (2-4 paragraphs max unless the user asks for more detail). Note: You provide financial education, not licensed financial advice.'
  },
  'brand-blueprint': {
    name: 'Brand Blueprint',
    systemPrompt: 'You are the RE UP course assistant for "Brand Blueprint" — a course that teaches barbers how to build a personal brand. You are an expert in social media strategy, content creation, personal branding, visual identity, Instagram/TikTok growth, client attraction, photography/videography for barbers, and marketing — all specifically for barbers and the barbering industry. Keep answers practical, actionable, and grounded in real barber business scenarios. Be encouraging but direct. Keep responses concise (2-4 paragraphs max unless the user asks for more detail).'
  }
};

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  name: 'reup_session',
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
  // No account / not logged in — send to membership page so they sign up first
  res.redirect('/pages/membership.html?redirect=' + encodeURIComponent(req.originalUrl));
}

function requireAuthAPI(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.status(401).json({ error: 'Please log in to access this feature.' });
}

// Gate the courses page and every individual course page
app.get('/pages/courses.html', requireAuth, function(req, res) {
  res.sendFile(path.join(__dirname, 'pages', 'courses.html'));
});

app.get('/pages/course-price-your-chair.html', requireAuth, function(req, res) {
  res.sendFile(path.join(__dirname, 'pages', 'course-price-your-chair.html'));
});

app.get('/pages/course-wealth-of-barbers.html', requireAuth, function(req, res) {
  res.sendFile(path.join(__dirname, 'pages', 'course-wealth-of-barbers.html'));
});

app.get('/pages/course-brand-blueprint.html', requireAuth, function(req, res) {
  res.sendFile(path.join(__dirname, 'pages', 'course-brand-blueprint.html'));
});

// --- Workbook API ---

// Get workbook data for a course
app.get('/api/workbook/:course', requireAuthAPI, function(req, res) {
  var userId = req.session.user.id;
  var course = req.params.course;

  var row = db.prepare('SELECT data FROM workbooks WHERE user_id = ? AND course = ?').get(userId, course);
  if (row) {
    try {
      res.json({ workbook: JSON.parse(row.data) });
    } catch(e) {
      res.json({ workbook: {} });
    }
  } else {
    res.json({ workbook: null });
  }
});

// Save workbook data for a course
app.post('/api/workbook/:course', requireAuthAPI, function(req, res) {
  var userId = req.session.user.id;
  var course = req.params.course;
  var data = req.body.data;

  if (!data || typeof data !== 'object') {
    return res.status(400).json({ error: 'Invalid workbook data.' });
  }

  var jsonData = JSON.stringify(data);

  db.prepare(`
    INSERT INTO workbooks (user_id, course, data, updated_at)
    VALUES (?, ?, ?, datetime('now'))
    ON CONFLICT(user_id, course) DO UPDATE SET
      data = excluded.data,
      updated_at = datetime('now')
  `).run(userId, course, jsonData);

  res.json({ ok: true });
});

// --- Chat API ---

// Get chat history for a course
app.get('/api/chat/history/:course', requireAuthAPI, function(req, res) {
  var userId = req.session.user.id;
  var course = req.params.course;

  var rows = db.prepare(
    'SELECT role, content FROM chat_history WHERE user_id = ? AND course = ? ORDER BY created_at ASC LIMIT 100'
  ).all(userId, course);

  res.json({ messages: rows });
});

// Send a chat message
app.post('/api/chat', requireAuthAPI, function(req, res) {
  var userId = req.session.user.id;
  var course = req.body.course;
  var message = (req.body.message || '').trim();

  if (!course || !message) {
    return res.status(400).json({ error: 'Course and message are required.' });
  }

  var context = courseContext[course];
  if (!context) {
    return res.status(400).json({ error: 'Unknown course.' });
  }

  // Save user message to history
  db.prepare(
    'INSERT INTO chat_history (user_id, course, role, content) VALUES (?, ?, ?, ?)'
  ).run(userId, course, 'user', message);

  // Get recent conversation history for context (last 20 messages)
  var history = db.prepare(
    'SELECT role, content FROM chat_history WHERE user_id = ? AND course = ? ORDER BY created_at DESC LIMIT 20'
  ).all(userId, course).reverse();

  // Build messages array for the AI
  var messages = history.map(function(msg) {
    return { role: msg.role, content: msg.content };
  });

  // Call AI API
  var apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Fallback: provide a helpful response without AI
    var fallback = generateFallbackResponse(course, message);
    db.prepare(
      'INSERT INTO chat_history (user_id, course, role, content) VALUES (?, ?, ?, ?)'
    ).run(userId, course, 'assistant', fallback);
    return res.json({ reply: fallback });
  }

  var requestBody = JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: context.systemPrompt,
    messages: messages
  });

  var options = {
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Length': Buffer.byteLength(requestBody)
    }
  };

  var apiReq = https.request(options, function(apiRes) {
    var data = '';
    apiRes.on('data', function(chunk) { data += chunk; });
    apiRes.on('end', function() {
      try {
        var parsed = JSON.parse(data);
        var reply = '';
        if (parsed.content && parsed.content.length > 0) {
          reply = parsed.content[0].text;
        } else if (parsed.error) {
          reply = 'I had trouble processing that. Please try again.';
        }

        // Save assistant reply to history
        db.prepare(
          'INSERT INTO chat_history (user_id, course, role, content) VALUES (?, ?, ?, ?)'
        ).run(userId, course, 'assistant', reply);

        res.json({ reply: reply });
      } catch(e) {
        res.json({ reply: 'I had trouble processing that. Please try again.' });
      }
    });
  });

  apiReq.on('error', function() {
    var fallback = generateFallbackResponse(course, message);
    db.prepare(
      'INSERT INTO chat_history (user_id, course, role, content) VALUES (?, ?, ?, ?)'
    ).run(userId, course, 'assistant', fallback);
    res.json({ reply: fallback });
  });

  apiReq.write(requestBody);
  apiReq.end();
});

// Fallback responses when no API key is configured
function generateFallbackResponse(course, message) {
  var lowerMsg = message.toLowerCase();
  var responses = {
    'price-your-chair': [
      "Great question about pricing. The key principle is: **your price should reflect your value, not just your time**. Consider what experience, consistency, and skill you bring to the chair. Most barbers undercharge by 20-40% based on market data. Start by calculating your true cost per hour (rent + supplies + time), then add your profit margin on top.",
      "When it comes to raising prices, **transparency wins**. Give clients 2-3 weeks notice, explain the value they get, and stand firm. The clients who leave over a $5 increase aren't your target market. The ones who stay? They value YOU, not just a cheap cut.",
      "A tiered pricing strategy works well: **Good, Better, Best**. Basic cut, signature cut with hot towel and beard line, and premium experience with scalp massage and product. This lets clients self-select and naturally increases your average ticket."
    ],
    'wealth-of-barbers': [
      "Smart thinking about your finances. The first rule of barber wealth: **pay yourself first**. Set up automatic transfers — the moment money hits your account, 25% goes to taxes, 15% to savings, and you live on the rest. This system removes willpower from the equation.",
      "For tax strategy, the biggest move most barbers miss is **tracking every deduction**. Your clippers, products, chair rent, continuing education, phone bill (business %), mileage — it all adds up. A good rule: if it helps you make money, it might be deductible. Keep receipts and use an app to track expenses.",
      "Building wealth as a barber is absolutely possible. The key is **multiple revenue streams**: services, product sales, education/mentoring, and investing your profits. Start with a SEP-IRA — you can contribute up to 25% of your net self-employment income, and it reduces your taxable income."
    ],
    'brand-blueprint': [
      "Building your brand starts with **consistency**. Same colors, same tone, same quality across every touchpoint — your Instagram, your shop, your business cards, how you greet clients. Your brand is the promise people associate with your name.",
      "For social media, focus on **transformation content** — before/after videos perform best for barbers. Film in good lighting, keep it under 30 seconds for reels, and always show the final result with a slow pan. Post at least 4-5 times per week and engage with every comment for the first hour.",
      "Your personal brand is what sets you apart from every other barber in your area. Ask yourself: **what do I want to be known for?** Speed? Precision fades? Luxury experience? Pick one thing and own it completely. That's your positioning."
    ]
  };

  var pool = responses[course] || responses['price-your-chair'];
  return pool[Math.floor(Math.random() * pool.length)];
}

// --- Static files (after auth routes so gating works) ---
app.use(express.static(__dirname));

// --- Start (local dev) / Export (Vercel) ---
if (require.main === module) {
  app.listen(PORT, function() {
    console.log('RE UP running on http://localhost:' + PORT);
  });
}

module.exports = app;
