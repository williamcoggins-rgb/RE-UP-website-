#!/usr/bin/env node
/* ============================================================
   RE UP Newsroom — Orchestrator ("Editor-in-Chief")

   Usage:
     node newsroom/run.js              — Run all desks
     node newsroom/run.js clt-local    — Run one desk only
     node newsroom/run.js --status     — Print current feed stats

   Workflow:
     1. Spin up each desk agent in parallel
     2. Collect all stories
     3. Deduplicate across desks
     4. Sort by score (highest first)
     5. Write data/exports/newsroom.json
     6. Print summary

   Schedule this with cron, GitHub Actions, or run manually.
   ============================================================ */

var fs = require('fs');
var path = require('path');
var config = require('./config');
var utils = require('./utils');

// --- Load desk agents ---
var DESK_MODULES = {
  'clt-local': require('./desks/clt-local'),
  'national-biz': require('./desks/national-biz'),
  'supply-chain': require('./desks/supply-chain'),
  'clt-events': require('./desks/clt-events')
};

// --- Parse CLI args ---
var args = process.argv.slice(2);
var statusOnly = args.indexOf('--status') !== -1;
var specificDesk = args.find(function (a) { return a in DESK_MODULES; });

function printBanner() {
  console.log('');
  console.log('  ╔══════════════════════════════════════════╗');
  console.log('  ║   RE UP REPORT — NEWSROOM PIPELINE      ║');
  console.log('  ║   Agents gathering intelligence...       ║');
  console.log('  ╚══════════════════════════════════════════╝');
  console.log('');
}

function printStatus() {
  if (!fs.existsSync(config.NEWSROOM_FILE)) {
    console.log('[STATUS] No newsroom.json found. Run the pipeline first.');
    return;
  }
  var feed = JSON.parse(fs.readFileSync(config.NEWSROOM_FILE, 'utf8'));
  var articles = feed.articles || [];
  console.log('[STATUS] Feed generated: ' + (feed.meta && feed.meta.generated));
  console.log('[STATUS] Total articles: ' + articles.length);

  // Count per desk
  var deskCounts = {};
  articles.forEach(function (a) {
    deskCounts[a.desk] = (deskCounts[a.desk] || 0) + 1;
  });
  Object.keys(deskCounts).forEach(function (d) {
    var meta = config.DESKS[d] || {};
    console.log('  ' + (meta.tag || d) + ': ' + deskCounts[d] + ' stories');
  });
  console.log('[STATUS] Search adapter: ' +
    (require('./adapters/web-search').isConfigured()
      ? require('./adapters/web-search').getProvider()
      : 'not configured (using seed stories only)'));
}

function runPipeline() {
  printBanner();

  var searchAdapter = require('./adapters/web-search');
  if (searchAdapter.isConfigured()) {
    console.log('[NEWSROOM] Live search enabled via: ' + searchAdapter.getProvider());
  } else {
    console.log('[NEWSROOM] No search API configured — using curated seed stories');
    console.log('[NEWSROOM] Set GOOGLE_CSE_KEY+GOOGLE_CSE_CX or NEWSAPI_KEY for live fetching');
    console.log('');
  }

  // Decide which desks to run
  var desksToRun = specificDesk ? [specificDesk] : Object.keys(DESK_MODULES);

  console.log('[NEWSROOM] Running desks: ' + desksToRun.join(', '));
  console.log('');

  // Run all desks in parallel
  var deskPromises = desksToRun.map(function (key) {
    var DeskClass = DESK_MODULES[key];
    var desk = new DeskClass();
    return desk.run();
  });

  return Promise.all(deskPromises).then(function (resultSets) {
    // Flatten all articles
    var allArticles = [];
    resultSets.forEach(function (set) {
      allArticles = allArticles.concat(set);
    });

    // If we're updating a single desk, merge with existing feed
    if (specificDesk && fs.existsSync(config.NEWSROOM_FILE)) {
      var existing = JSON.parse(fs.readFileSync(config.NEWSROOM_FILE, 'utf8'));
      var otherArticles = (existing.articles || []).filter(function (a) {
        return a.desk !== specificDesk;
      });
      allArticles = otherArticles.concat(allArticles);
    }

    // Deduplicate
    allArticles = utils.dedup(allArticles);

    // Sort by score descending
    allArticles.sort(function (a, b) { return b.score - a.score; });

    // Build the feed
    var feed = {
      meta: {
        report: 'RE UP Report — Newsroom Feed',
        generated: new Date().toISOString(),
        desks_run: desksToRun,
        total_articles: allArticles.length,
        search_provider: searchAdapter.isConfigured() ? searchAdapter.getProvider() : 'seed-only'
      },
      articles: allArticles
    };

    // Ensure export directory exists before writing
    var exportDir = path.dirname(config.NEWSROOM_FILE);
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    // Write to disk
    fs.writeFileSync(config.NEWSROOM_FILE, JSON.stringify(feed, null, 2));
    console.log('');
    console.log('[NEWSROOM] ✓ Feed written to data/exports/newsroom.json');
    console.log('[NEWSROOM] ' + allArticles.length + ' total articles');

    // Summary per desk
    var summary = {};
    allArticles.forEach(function (a) {
      summary[a.desk] = (summary[a.desk] || 0) + 1;
    });
    Object.keys(summary).forEach(function (d) {
      var meta = config.DESKS[d] || {};
      console.log('  ' + (meta.tag || d) + ': ' + summary[d] + ' stories');
    });

    // Top 3 stories
    console.log('');
    console.log('[NEWSROOM] Top stories:');
    allArticles.slice(0, 3).forEach(function (a, i) {
      console.log('  ' + (i + 1) + '. [' + a.score + '] ' + a.title.slice(0, 70));
    });
    console.log('');

    return feed;
  });
}

// --- Entry point ---
if (statusOnly) {
  printStatus();
} else {
  runPipeline().catch(function (err) {
    console.error('[NEWSROOM] Fatal error:', err);
    process.exit(1);
  });
}
