/* ============================================================
   RE UP Newsroom — Configuration
   Shared constants, search terms, and scoring rules
   for every desk in the newsroom.
   ============================================================ */

var path = require('path');

// --- Output location ---
var DATA_DIR = path.join(__dirname, '..', 'data', 'exports');
var NEWSROOM_FILE = path.join(DATA_DIR, 'newsroom.json');

// --- Desks (beats) ---
var DESKS = {
  'clt-local': {
    name: 'Charlotte Local',
    tag: 'CLT LOCAL',
    color: 'charlotte',
    description: 'What\'s happening in and around Charlotte barbershops'
  },
  'national-biz': {
    name: 'National Barber Business',
    tag: 'NATIONAL',
    color: 'national',
    description: 'Business moves across the barber industry nationwide'
  },
  'supply-chain': {
    name: 'Supply Chain',
    tag: 'SUPPLY CHAIN',
    color: 'supply',
    description: 'Products, equipment, distributors, and brand news'
  },
  'clt-events': {
    name: 'Charlotte Events',
    tag: 'CLT EVENTS',
    color: 'events',
    description: 'Upcoming events in Charlotte that may affect barber income'
  }
};

// --- Search queries each desk uses when gathering stories ---
var DESK_QUERIES = {
  'clt-local': [
    'Charlotte barbershop news',
    'Charlotte barber shooting OR arrest OR opening OR closing',
    'Charlotte NC barber community',
    'Charlotte barbershop fire OR robbery OR license',
    'No Grease barbershop Charlotte',
    '"Charlotte barber" 2025 OR 2026'
  ],
  'national-biz': [
    'barbershop business news United States',
    'barber franchise expansion 2025 OR 2026',
    'barber licensing law change',
    'Squire barber technology',
    'barbershop pricing trends',
    'barber industry revenue growth'
  ],
  'supply-chain': [
    'barber supply shortage OR recall',
    'Andis OR Wahl OR BabylissPRO new product',
    'barber supply distributor news',
    'salon barber product price increase',
    'barber clippers trimmers 2025 OR 2026 launch'
  ],
  'clt-events': [
    'Charlotte NC events this month',
    'Charlotte concerts festivals 2025 OR 2026',
    'Charlotte Panthers Hornets game schedule',
    'Charlotte road construction closures',
    'Charlotte NC convention center events',
    'Charlotte food truck festival OR block party'
  ]
};

// --- Relevance scoring weights ---
// Stories are scored 0-100 so editors (or future ML) can rank them
var SCORING = {
  recency_weight: 40,       // newer = higher
  relevance_weight: 35,     // keyword match density
  source_trust_weight: 25,  // trusted outlets score higher
  trusted_sources: [
    'wbtv.com', 'wsoctv.com', 'wcnc.com', 'wfae.org',
    'charlotteobserver.com', 'axios.com', 'qcitymetro.com',
    'bizjournals.com', 'reuters.com', 'apnews.com',
    'barberevo.com', 'modernsalon.com', 'americansalonmag.com'
  ]
};

// --- Article schema (what every story object must look like) ---
// {
//   id:        string   — deterministic hash of url
//   desk:      string   — desk key e.g. 'clt-local'
//   title:     string   — headline
//   summary:   string   — 1-3 sentence summary
//   url:       string   — source link
//   source:    string   — publication name
//   date:      string   — ISO date or human-readable
//   score:     number   — 0-100 relevance score
//   impact:    string   — 'high' | 'medium' | 'low'
//   tags:      string[] — freeform tags for filtering
//   gathered:  string   — ISO timestamp when agent found this
// }

module.exports = {
  DATA_DIR: DATA_DIR,
  NEWSROOM_FILE: NEWSROOM_FILE,
  DESKS: DESKS,
  DESK_QUERIES: DESK_QUERIES,
  SCORING: SCORING
};
