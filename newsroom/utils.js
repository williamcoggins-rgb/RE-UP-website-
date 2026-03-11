/* ============================================================
   RE UP Newsroom — Shared Utilities
   Hashing, scoring, dedup, date helpers
   ============================================================ */

var crypto = require('crypto');
var config = require('./config');

// Deterministic article ID from URL
function articleId(url) {
  return crypto.createHash('sha256').update(url).digest('hex').slice(0, 12);
}

// Score an article 0-100
function scoreArticle(article) {
  var score = 0;

  // Recency (0-40): articles < 7 days old get full marks, decays over 90 days
  var now = Date.now();
  var articleDate = new Date(article.date).getTime();
  if (!isNaN(articleDate)) {
    var daysOld = (now - articleDate) / (1000 * 60 * 60 * 24);
    var recency = Math.max(0, 1 - (daysOld / 90));
    score += recency * config.SCORING.recency_weight;
  } else {
    score += config.SCORING.recency_weight * 0.3; // unknown date gets partial credit
  }

  // Source trust (0-25)
  var domain = extractDomain(article.url || '');
  var isTrusted = config.SCORING.trusted_sources.some(function (d) {
    return domain.indexOf(d) !== -1;
  });
  score += isTrusted ? config.SCORING.source_trust_weight : config.SCORING.source_trust_weight * 0.4;

  // Relevance (0-35): keyword hits in title + summary
  var text = ((article.title || '') + ' ' + (article.summary || '')).toLowerCase();
  var keywords = ['barber', 'barbershop', 'charlotte', 'haircut', 'fade', 'clippers',
    'supply', 'pricing', 'license', 'no grease', 'booth rent', 'barber school'];
  var hits = 0;
  keywords.forEach(function (kw) {
    if (text.indexOf(kw) !== -1) hits++;
  });
  var relevance = Math.min(1, hits / 4);
  score += relevance * config.SCORING.relevance_weight;

  return Math.round(score);
}

// Classify impact from score
function classifyImpact(score) {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

// Pull domain from URL
function extractDomain(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch (e) {
    return '';
  }
}

// Deduplicate articles by URL (keep highest score)
function dedup(articles) {
  var seen = {};
  articles.forEach(function (a) {
    var id = a.id || articleId(a.url);
    if (!seen[id] || (a.score || 0) > (seen[id].score || 0)) {
      seen[id] = a;
    }
  });
  return Object.keys(seen).map(function (k) { return seen[k]; });
}

// Format an article object with all required fields
function formatArticle(desk, raw) {
  var id = articleId(raw.url);
  var score = scoreArticle(raw);
  return {
    id: id,
    desk: desk,
    title: raw.title || 'Untitled',
    summary: raw.summary || '',
    url: raw.url || '',
    source: raw.source || extractDomain(raw.url || ''),
    date: raw.date || new Date().toISOString().split('T')[0],
    score: score,
    impact: classifyImpact(score),
    tags: raw.tags || [],
    gathered: new Date().toISOString()
  };
}

module.exports = {
  articleId: articleId,
  scoreArticle: scoreArticle,
  classifyImpact: classifyImpact,
  extractDomain: extractDomain,
  dedup: dedup,
  formatArticle: formatArticle
};
