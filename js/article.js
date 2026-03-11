/* ============================================================
   RE UP Report — Article Detail Renderer
   Reads article ID from ?id= query param, finds it in the
   news feed, and renders the full story with impact outlook.
   ============================================================ */

(function () {
  var DESK_META = {
    'clt-local':    { tagClass: 'news-tag--charlotte', label: 'CLT Local' },
    'national-biz': { tagClass: 'news-tag--national',  label: 'National' },
    'supply-chain': { tagClass: 'news-tag--supply',    label: 'Supply Chain' },
    'clt-events':   { tagClass: 'news-tag--events',    label: 'CLT Events' }
  };

  function getArticleId() {
    var params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  function formatDate(dateStr) {
    try {
      var d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      }
    } catch (e) { /* fall through */ }
    return dateStr || '';
  }

  function renderArticle(article) {
    var container = document.getElementById('article-container');
    if (!container) return;

    if (!article) {
      container.innerHTML =
        '<div class="article-not-found">' +
          '<h2>Story not found</h2>' +
          '<p>This article may have been removed or the link is invalid.</p>' +
          '<a href="../index.html#news-section" class="btn btn-primary">Back to News</a>' +
        '</div>';
      return;
    }

    var meta = DESK_META[article.desk] || { tagClass: 'news-tag--charlotte', label: article.desk };

    // Set page title
    document.title = article.title + ' | RE UP Report';

    // Impact badge
    var impactHtml = '';
    if (article.impact && article.impact !== 'low') {
      var cls = article.impact === 'high' ? 'news-impact--high' : 'news-impact--medium';
      impactHtml = '<span class="news-impact ' + cls + '">' + article.impact.toUpperCase() + ' IMPACT</span>';
    }

    // Body paragraphs
    var bodyHtml = '';
    if (article.body && article.body.length) {
      for (var i = 0; i < article.body.length; i++) {
        bodyHtml += '<p>' + escapeHtml(article.body[i]) + '</p>';
      }
    } else {
      // Fallback to summary if no body
      bodyHtml = '<p>' + escapeHtml(article.summary) + '</p>';
    }

    // Outlook section
    var outlookHtml = '';
    if (article.outlook) {
      outlookHtml =
        '<div class="article-outlook">' +
          '<div class="article-outlook-header">' +
            '<span class="article-outlook-icon">\u2192</span>' +
            '<span class="article-outlook-timeframe">How This Affects You: ' + escapeHtml(article.outlook.timeframe) + '</span>' +
          '</div>' +
          '<p class="article-outlook-text">' + escapeHtml(article.outlook.text) + '</p>' +
        '</div>';
    }

    // Tags
    var tagsHtml = '';
    if (article.tags && article.tags.length) {
      tagsHtml = '<div class="article-tags">';
      for (var t = 0; t < article.tags.length; t++) {
        tagsHtml += '<span class="article-tag">' + escapeHtml(article.tags[t]) + '</span>';
      }
      tagsHtml += '</div>';
    }

    container.innerHTML =
      '<article class="article-full">' +
        '<a href="../index.html#news-section" class="article-back">&larr; Back to News</a>' +
        '<div class="article-meta">' +
          '<span class="news-tag ' + meta.tagClass + '">' + meta.label + '</span>' +
          impactHtml +
        '</div>' +
        '<h1 class="article-headline">' + escapeHtml(article.title) + '</h1>' +
        '<div class="article-info">' +
          '<span class="article-byline">' + escapeHtml(article.byline || article.source) + '</span>' +
          '<span class="article-date">' + formatDate(article.date) + '</span>' +
        '</div>' +
        '<div class="article-body">' +
          bodyHtml +
        '</div>' +
        outlookHtml +
        tagsHtml +
      '</article>';
  }

  function init() {
    var id = getArticleId();
    if (!id) {
      renderArticle(null);
      return;
    }

    // Try to get article from already-loaded feed
    if (window.RE_UP_NEWS) {
      var article = window.RE_UP_NEWS.findArticle(id);
      if (article) {
        renderArticle(article);
        return;
      }
    }

    // Wait for news.js to finish loading data
    window.addEventListener('newsready', function () {
      var article = window.RE_UP_NEWS ? window.RE_UP_NEWS.findArticle(id) : null;
      renderArticle(article);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
