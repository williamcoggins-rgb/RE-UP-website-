/* ============================================================
   RE UP Report — Article Detail Renderer
   Reads article ID from ?id= query param, finds it in the
   news feed, and renders the full story with impact outlook.

   Free users see: headline + first paragraph (teaser)
   RE UP Intel subscribers see: full body + outlook + action items
   ============================================================ */

(function () {
  var DESK_META = {
    'clt-local':    { tagClass: 'news-tag--charlotte', label: 'CLT Local' },
    'national-biz': { tagClass: 'news-tag--national',  label: 'National' },
    'supply-chain': { tagClass: 'news-tag--supply',    label: 'Supply Chain' },
    'clt-events':   { tagClass: 'news-tag--events',    label: 'CLT Events' }
  };

  // Server-side access check via shared auth utility
  function checkAccess(callback) {
    if (window.RE_UP_AUTH) {
      window.RE_UP_AUTH.isAuthenticated().then(function (authed) {
        callback(authed);
      });
    } else {
      callback(false);
    }
  }

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

  function buildPaywall() {
    return '' +
      '<div class="paywall">' +
        '<div class="paywall-fade"></div>' +
        '<div class="paywall-gate">' +

          '<div class="paywall-header">' +
            '<span class="paywall-lock">&#9679;</span>' +
            '<h2 class="paywall-title">This story continues with RE\u00a0UP Intel</h2>' +
            '<p class="paywall-subtitle">Market intelligence built for barbers who run their chair like a business</p>' +
          '</div>' +

          '<div class="paywall-value">' +
            '<h3 class="paywall-value-heading">What you get</h3>' +
            '<ul class="paywall-features">' +
              '<li>' +
                '<strong>Full analysis &amp; deep context</strong>' +
                '<span>Every story includes the full breakdown — not just what happened, but what it means for your bookings, pricing, and bottom line.</span>' +
              '</li>' +
              '<li>' +
                '<strong>"How This Affects You" action briefs</strong>' +
                '<span>Each article ends with a concrete outlook: what to do this week, this month, or this quarter based on the news. No guesswork.</span>' +
              '</li>' +
              '<li>' +
                '<strong>Charlotte market data &amp; pricing benchmarks</strong>' +
                '<span>See what shops across Charlotte are charging by service, neighborhood, and experience level. Know if you\'re underpriced before your clients do.</span>' +
              '</li>' +
              '<li>' +
                '<strong>Event-driven booking strategy</strong>' +
                '<span>We track every major Charlotte event — ACC Tournament, SHOUT!, race week, MLS — and tell you exactly how to capture the revenue spike.</span>' +
              '</li>' +
              '<li>' +
                '<strong>Supply chain &amp; product alerts</strong>' +
                '<span>Price changes on clippers, blades, and products — reported before they hit your distributor\'s invoice. Plan your costs, protect your margins.</span>' +
              '</li>' +
            '</ul>' +
          '</div>' +

          '<div class="paywall-plans">' +
            '<div class="paywall-plan">' +
              '<div class="paywall-plan-name">Intel Monthly</div>' +
              '<div class="paywall-plan-price"><span class="paywall-currency">$</span>9<span class="paywall-period">/mo</span></div>' +
              '<ul class="paywall-plan-includes">' +
                '<li>Full articles &amp; outlook briefs</li>' +
                '<li>Charlotte market dashboard</li>' +
                '<li>Weekly email intel digest</li>' +
              '</ul>' +
              '<button class="btn btn-primary paywall-cta" data-plan="monthly">Start 7-Day Free Trial</button>' +
            '</div>' +
            '<div class="paywall-plan paywall-plan--featured">' +
              '<div class="paywall-plan-badge">Best Value</div>' +
              '<div class="paywall-plan-name">Intel Annual</div>' +
              '<div class="paywall-plan-price"><span class="paywall-currency">$</span>79<span class="paywall-period">/yr</span></div>' +
              '<div class="paywall-plan-savings">Save $29 vs monthly</div>' +
              '<ul class="paywall-plan-includes">' +
                '<li>Everything in Monthly</li>' +
                '<li>Quarterly market reports</li>' +
                '<li>Priority access to new tools</li>' +
              '</ul>' +
              '<button class="btn btn-primary paywall-cta" data-plan="annual">Start 7-Day Free Trial</button>' +
            '</div>' +
          '</div>' +

          '<p class="paywall-note">Cancel anytime. No charge during trial. Built by barbers, for barbers.</p>' +

        '</div>' +
      '</div>';
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

    checkAccess(function (unlocked) {
    var meta = DESK_META[article.desk] || { tagClass: 'news-tag--charlotte', label: article.desk };

    // Set page title
    document.title = article.title + ' | RE UP Report';

    // Impact badge
    var impactHtml = '';
    if (article.impact && article.impact !== 'low') {
      var cls = article.impact === 'high' ? 'news-impact--high' : 'news-impact--medium';
      impactHtml = '<span class="news-impact ' + cls + '">' + article.impact.toUpperCase() + ' IMPACT</span>';
    }

    // Body paragraphs — split into teaser (1st para) and gated (rest)
    var teaserHtml = '';
    var gatedHtml = '';
    if (article.body && article.body.length) {
      teaserHtml = '<p>' + escapeHtml(article.body[0]) + '</p>';
      for (var i = 1; i < article.body.length; i++) {
        gatedHtml += '<p>' + escapeHtml(article.body[i]) + '</p>';
      }
    } else {
      teaserHtml = '<p>' + escapeHtml(article.summary) + '</p>';
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

    // Build the full article HTML
    var html =
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
          teaserHtml;

    if (unlocked) {
      // Full access — show everything
      html += gatedHtml +
        '</div>' +
        outlookHtml +
        tagsHtml;
    } else {
      // Gated — show blurred preview + paywall
      html +=
        '</div>' +
        '<div class="article-gated-preview">' +
          '<div class="article-gated-blur">' + gatedHtml + outlookHtml + '</div>' +
        '</div>' +
        buildPaywall() +
        tagsHtml;
    }

    html += '</article>';
    container.innerHTML = html;

    // Attach CTA handlers
    if (!unlocked) {
      var buttons = container.querySelectorAll('.paywall-cta');
      for (var b = 0; b < buttons.length; b++) {
        buttons[b].addEventListener('click', function () {
          var plan = this.getAttribute('data-plan');
          handleSubscribe(plan);
        });
      }
    }
    }); // end checkAccess callback
  }

  function handleSubscribe(plan) {
    // Placeholder — wire to Stripe, Gumroad, or custom backend
    // For now show a signup prompt
    var email = prompt('Enter your email to start your free trial (' + plan + ' plan):');
    if (email && email.indexOf('@') > 0) {
      alert('Thanks! We\u2019ll send your trial access to ' + email + '. Check your inbox.');
      // In production: POST to /api/subscribe with email + plan
    }
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
