/* ============================================================
   RE UP Newsroom — Base Desk (Agent Template)

   Every desk agent follows this workflow:
   1. gather()  — Fetch raw stories from sources
   2. filter()  — Remove irrelevant / duplicate stories
   3. enrich()  — Score, tag, classify impact
   4. publish() — Return formatted articles ready for the feed

   Subclasses override gather() with their beat-specific logic.
   ============================================================ */

var config = require('../config');
var utils = require('../utils');

function BaseDesk(deskKey) {
  this.deskKey = deskKey;
  this.meta = config.DESKS[deskKey];
  this.queries = config.DESK_QUERIES[deskKey] || [];
}

// --- Step 1: Gather raw stories ---
// Override in subclass. Must return array of { title, summary, url, source, date, tags }
BaseDesk.prototype.gather = function () {
  return Promise.resolve([]);
};

// --- Step 2: Filter ---
BaseDesk.prototype.filter = function (rawArticles) {
  // Remove articles with no URL or no title
  return rawArticles.filter(function (a) {
    return a && a.url && a.title && a.title.length > 10;
  });
};

// --- Step 3: Enrich (score + format) ---
BaseDesk.prototype.enrich = function (articles) {
  var desk = this.deskKey;
  return articles.map(function (a) {
    return utils.formatArticle(desk, a);
  });
};

// --- Step 4: Full pipeline ---
BaseDesk.prototype.run = function () {
  var self = this;
  console.log('[NEWSROOM] ' + this.meta.name + ' desk starting...');

  return this.gather()
    .then(function (raw) {
      console.log('[NEWSROOM] ' + self.meta.name + ': gathered ' + raw.length + ' raw stories');
      var filtered = self.filter(raw);
      console.log('[NEWSROOM] ' + self.meta.name + ': ' + filtered.length + ' after filtering');
      var enriched = self.enrich(filtered);
      // Sort by score descending
      enriched.sort(function (a, b) { return b.score - a.score; });
      console.log('[NEWSROOM] ' + self.meta.name + ' desk done. Top score: ' +
        (enriched[0] ? enriched[0].score : 'n/a'));
      return enriched;
    })
    .catch(function (err) {
      console.error('[NEWSROOM] ' + self.meta.name + ' desk error:', err.message);
      return [];
    });
};

module.exports = BaseDesk;
