/* ============================================================
   RE UP Newsroom — Configuration
   Shared constants, search terms, and scoring rules
   for every desk in the newsroom.

   NOTE: RE UP Report journalists write original stories based on
   verified findings from web, social media, and industry sources.
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
    description: 'Upcoming events in Charlotte that affect barber culture and income'
  }
};

// --- Search queries each desk uses when gathering stories ---
// Journalists use these to research social media and web sources
var DESK_QUERIES = {
  'clt-local': [
    'Charlotte barbershop opening new location 2026',
    'Charlotte barber community giveback event',
    'Charlotte NC barber mentorship program',
    'No Grease barbershop Charlotte expansion',
    '"Charlotte barber" growth OR success OR award 2026',
    'Charlotte barbershop booking trends'
  ],
  'national-biz': [
    'barbershop business growth United States 2026',
    'barber franchise expansion 2026',
    'barber licensing law reform 2026',
    'barber booking technology Squire Boulevard',
    'barbershop pricing trends revenue',
    'barber industry market report 2026'
  ],
  'supply-chain': [
    'BabylissPRO new clipper 2026 launch',
    'Andis OR Wahl new product barber 2026',
    'barber supply innovation cordless',
    'barber product review trending',
    'barber supply distributor partnership'
  ],
  'clt-events': [
    'Charlotte barber battle competition 2026',
    'Charlotte NC barber expo event 2026',
    'Charlotte community haircut event',
    'Charlotte Motor Speedway race week barber 2026',
    'Charlotte NC spring events festival 2026'
  ]
};

// --- Relevance scoring weights ---
// Stories are scored 0-100 so editors (or future ML) can rank them
var SCORING = {
  recency_weight: 40,       // newer = higher
  relevance_weight: 35,     // keyword match density
  source_trust_weight: 25,  // trusted outlets + RE UP originals score higher
  trusted_sources: [
    'wbtv.com', 'wsoctv.com', 'wcnc.com', 'wfae.org',
    'charlotteobserver.com', 'axios.com', 'qcitymetro.com',
    'bizjournals.com', 'reuters.com', 'apnews.com',
    'barberevo.com', 'modernsalon.com', 'americansalonmag.com',
    're-up-website-production.up.railway.app'
  ]
};

// --- Article schema (what every story object must look like) ---
// {
//   id:        string   — deterministic hash of url
//   desk:      string   — desk key e.g. 'clt-local'
//   title:     string   — headline
//   summary:   string   — 1-3 sentence summary
//   url:       string   — source link (or '#' for originals)
//   source:    string   — publication name (or 'RE UP Report')
//   byline:    string   — author credit for original stories
//   date:      string   — ISO date or human-readable
//   score:     number   — 0-100 relevance score
//   impact:    string   — 'high' | 'medium' | 'low'
//   tags:      string[] — freeform tags for filtering
//   gathered:  string   — ISO timestamp when agent found this
//   type:      string   — 'original' (RE UP written) or 'aggregated'
// }

module.exports = {
  DATA_DIR: DATA_DIR,
  NEWSROOM_FILE: NEWSROOM_FILE,
  DESKS: DESKS,
  DESK_QUERIES: DESK_QUERIES,
  SCORING: SCORING
};
