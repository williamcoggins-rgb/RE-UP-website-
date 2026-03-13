/* ============================================================
   RE UP Newsroom — Base Desk (Agent Template)

   Every desk agent follows this workflow:
   1. gather()  — Fetch raw stories from sources
   2. filter()  — Remove irrelevant / duplicate stories
   3. enrich()  — Score, tag, classify impact (governed by doctrine)
   4. publish() — Return formatted articles ready for the feed

   All desk agents inherit the Editorial Doctrine from config as
   their foundational system prompt. The doctrine governs how
   articles are generated, enriched, and structured.

   Subclasses override gather() with their beat-specific logic.
   ============================================================ */

var config = require('../config');
var utils = require('../utils');

function BaseDesk(deskKey) {
  this.deskKey = deskKey;
  this.meta = config.DESKS[deskKey];
  this.queries = config.DESK_QUERIES[deskKey] || [];

  // The Editorial Doctrine is the system prompt foundation for all desk agents.
  // Every article generated or enriched by this desk must follow these standards.
  this.systemPrompt = config.EDITORIAL_DOCTRINE;
  this.articleStructure = config.ARTICLE_STRUCTURE;
}

// --- Get the full system prompt for this desk agent ---
// Combines the Editorial Doctrine with desk-specific context.
// Subclasses can override getDeskDirective() to add beat-specific instructions.
BaseDesk.prototype.getSystemPrompt = function () {
  var prompt = this.systemPrompt + '\n\n';
  prompt += '--- DESK ASSIGNMENT ---\n';
  prompt += 'Desk: ' + this.meta.name + '\n';
  prompt += 'Beat: ' + this.meta.description + '\n';
  prompt += 'Tag: ' + this.meta.tag + '\n\n';
  prompt += '--- REQUIRED ARTICLE STRUCTURE ---\n';
  prompt += 'Every article must include these elements:\n';
  this.articleStructure.required.forEach(function (field) {
    prompt += '- ' + field + '\n';
  });
  prompt += '\nPlaybook fields:\n';
  var playbook = this.articleStructure.playbook;
  Object.keys(playbook).forEach(function (key) {
    prompt += '- ' + key + ': ' + playbook[key] + '\n';
  });

  var deskDirective = this.getDeskDirective();
  if (deskDirective) {
    prompt += '\n--- DESK-SPECIFIC DIRECTIVE ---\n';
    prompt += deskDirective + '\n';
  }

  return prompt;
};

// --- Desk-specific directive (override in subclass) ---
// Returns additional instructions specific to this beat.
BaseDesk.prototype.getDeskDirective = function () {
  return '';
};

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

// --- Step 3: Enrich (score + format + apply doctrine) ---
// The enrichment step applies the Editorial Doctrine standards to every article.
// The system prompt (doctrine + desk context) is attached so downstream
// AI agents use it as their operating instructions when generating or
// rewriting article content.
BaseDesk.prototype.enrich = function (articles) {
  var desk = this.deskKey;
  var systemPrompt = this.getSystemPrompt();
  var structure = this.articleStructure;
  return articles.map(function (a) {
    var formatted = utils.formatArticle(desk, a);
    // Attach doctrine context so any AI agent processing this article
    // has the full editorial standards and required structure available.
    formatted._doctrinePrompt = systemPrompt;
    formatted._requiredStructure = structure.required;
    formatted._playbook = structure.playbook;
    return formatted;
  });
};

// --- Step 4: Full pipeline ---
BaseDesk.prototype.run = function () {
  var self = this;
  console.log('[NEWSROOM] ' + this.meta.name + ' desk starting...');
  console.log('[NEWSROOM] ' + this.meta.name + ': Editorial Doctrine loaded (' +
    self.systemPrompt.split('\n').length + ' lines)');

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
