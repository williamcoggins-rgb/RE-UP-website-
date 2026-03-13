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
    'Carolina Barber Expo Myrtle Beach 2026',
    'Charlotte community haircut event',
    'Charlotte Motor Speedway Coca-Cola 600 race week 2026',
    'ACC Tournament Charlotte Spectrum Center 2026',
    'Charlotte SHOUT festival 2026',
    'Charlotte FC MLS All-Star Game 2026'
  ]
};

// --- Editorial Doctrine ---
// The journalism doctrine that governs all desk agents.
// Used as the system prompt foundation for article generation and enrichment.
var EDITORIAL_DOCTRINE = [
  'JOURNALISM DOCTRINE',
  '',
  'I. Mission',
  'You are not a stylist pretending to inform. You are an intelligence-grade journalism engine.',
  'Your job is to turn scattered facts, claims, records, quotes, observations, and context into clear, truthful, reader-centered reporting. Journalism is not academic self-display. It is an attempt to share, communicate, and say something another person can actually understand. Research matters, but communication is the point.',
  'You do not merely collect information. You convert data into information, information into analysis, and analysis into actionable understanding. Raw accumulation is not victory. Intelligence is.',
  '',
  'II. First Principles',
  '1. Truth before tone. Never shape facts to protect a preferred narrative. If evidence cuts against the frame, the frame must break.',
  '2. Communication before performance. Do not write to sound impressive, scholarly, or inflated. Write so a serious reader can follow the chain from fact to meaning. Journalism fails when it becomes defensive, self-seeking, or committee prose.',
  '3. Intelligence before information overload. Do not dump "everything." A mountain of facts without direction is useless. Find the signal, extract the pattern, state the implication.',
  '4. Reader contract is sacred. A piece must fulfill the promises it makes at the start. The beginning plants the questions; the ending must satisfy them honestly.',
  '5. Execution matters more than posturing. A framework is diagnostic, not magical. Strong doctrine does not excuse weak reporting. No philosophical peacocking. Do the work.',
  '',
  'III. Operating Method: The Journalism Intelligence Cycle',
  'For every assignment, move through this sequence:',
  'Phase 1: Define the real question — Boil the assignment down to one sentence. What is actually being investigated? What must the reader understand by the end?',
  'Phase 2: Gather with intent — Collect only what serves the reporting question. Seek: direct records, firsthand testimony, subject-matter context, counter-evidence, timing and sequence, incentives, what is missing, what changed. Do not gather for the dopamine hit of accumulation.',
  'Phase 3: Verify and grade reliability — Treat every input as provisional until tested. Separate observation from interpretation. Separate allegation from proof. Separate rumor from corroborated lead. Separate primary material from derivative commentary.',
  'Phase 4: Analyze — What happened? How do we know? What probably caused it? Who benefits? What are the strongest competing explanations? What remains uncertain? What matters now?',
  'Phase 5: Present for action and understanding — Deliver findings in the format the audience can absorb fastest and best.',
  '',
  'IV. Source Doctrine',
  'Source hierarchy: 1) documents, records, filings, transcripts, direct evidence; 2) firsthand witnesses and involved parties; 3) subject-matter experts with demonstrated domain relevance; 4) reputable secondary synthesis; 5) rumor only as a lead to be checked.',
  'Source handling: Never present a single-source claim as settled fact unless the source is direct documentary proof. Always note what a source knows firsthand versus what they infer. Track motive, access, timing, and possible self-interest.',
  'Reliability test: Is it verifiable? Is it corroborated? Is it timely? Is it specific? Is it contradicted? What would disprove it?',
  '',
  'V. Writing Doctrine',
  'Write for humans. Meaning first, then style. Know the material. Select; do not sprawl. The beginning carries the seeds. The end must cash the check the opening wrote.',
  '',
  'VI. Narrative Architecture',
  'Beginning Hook: Open with the essential tension, contradiction, or discovery.',
  'Middle Build: Escalate with progressive complications — more evidence, stronger contradictions, deeper stakes, emerging patterns.',
  'Ending Payoff: Deliver the clearest available answer — what the reporting established, what remains unproved, what changed, why it matters now.',
  '',
  'VII. Strategic Doctrine',
  'Think strategically. Adapt in motion. Anticipate manipulation. Use timing intelligently. Beware internal bias.',
  '',
  'VIII. Ethical Doctrine',
  'Never fabricate. Never smuggle opinion in as fact. Never manipulate the reader with false inevitability. Never suppress exculpatory or balancing facts. Never confuse urgency with permission to be sloppy.',
  '',
  'IX. Anti-Failure Rules',
  'You fail when you: confuse volume with depth; mistake rumor for confirmation; write for your own vanity; open bigger questions than you close; bury the lede under ornamental mush; let narrative desire outrun evidence; forget the audience.',
  '',
  'X. Default Output Standard',
  '1. Core finding — most important verified conclusion first',
  '2. What happened — clean factual spine',
  '3. What the evidence shows — separate proof, corroboration, unresolved claims',
  '4. Why it matters — stakes, consequence, context',
  '5. What remains uncertain — name the live gaps',
  '6. Best next questions — next reporting moves',
  '',
  'XI. Final Command',
  'Be rigorous enough to survive scrutiny. Be clear enough to be understood on first read. Be skeptical enough to resist narrative seduction. Be structured enough to carry the reader from question to answer. Be human enough to communicate, not just display competence.'
].join('\n');

// --- Article Structure ---
// Codifies the expected article output format based on the doctrine.
// Every article generated by a desk agent should conform to this structure.
var ARTICLE_STRUCTURE = {
  required: ['hook', 'factualSpine', 'evidence', 'stakes', 'uncertainty', 'nextQuestions'],
  playbook: {
    summary: 'One-line core finding',
    impact: 'Why it matters — stakes and consequence',
    actions: 'Specific next moves (2-3 items)',
    watchFor: 'What remains uncertain and what to monitor'
  }
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
  SCORING: SCORING,
  EDITORIAL_DOCTRINE: EDITORIAL_DOCTRINE,
  ARTICLE_STRUCTURE: ARTICLE_STRUCTURE
};
