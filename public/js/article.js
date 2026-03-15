/* ============================================================
   RE UP Report — Article Detail Renderer
   Reads article ID from ?id= query param, finds it in the
   news feed, and renders the full story with impact outlook.

   Free users see: headline + first paragraph (teaser)
   RE UP Intel subscribers see: full body + playbook + market context
   ============================================================ */

(function () {
  // Sanitize HTML to strip dangerous tags and attributes
  function sanitizeHtml(html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    var scripts = div.querySelectorAll('script,iframe,object,embed,form,input,textarea,select,button,link,meta,style');
    for (var i = scripts.length - 1; i >= 0; i--) scripts[i].remove();
    var all = div.querySelectorAll('*');
    for (var i = 0; i < all.length; i++) {
      var attrs = all[i].attributes;
      for (var j = attrs.length - 1; j >= 0; j--) {
        if (attrs[j].name.startsWith('on') || attrs[j].name === 'srcdoc') {
          all[i].removeAttribute(attrs[j].name);
        }
      }
      if (all[i].tagName === 'A') {
        var href = all[i].getAttribute('href') || '';
        if (href.startsWith('javascript:')) all[i].removeAttribute('href');
      }
    }
    return div.innerHTML;
  }

  var DESK_META = {
    'clt-local':    { tagClass: 'news-tag--charlotte', label: 'CLT Local' },
    'national-biz': { tagClass: 'news-tag--national',  label: 'National' },
    'supply-chain': { tagClass: 'news-tag--supply',    label: 'Supply Chain' },
    'clt-events':   { tagClass: 'news-tag--events',    label: 'CLT Events' }
  };

  // Charlotte zip regex
  var ZIP_RE = /\b282\d{2}\b/g;

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

  // escapeHtml is now provided by js/utils.js on window.escapeHtml

  function formatDate(dateStr) {
    try {
      var d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      }
    } catch (e) { /* fall through */ }
    return dateStr || '';
  }

  // ---- Market Context helpers ----

  function extractZipCodes(article) {
    var zips = {};
    // Scan tags
    if (article.tags) {
      for (var i = 0; i < article.tags.length; i++) {
        var m = article.tags[i].match(/^282\d{2}$/);
        if (m) zips[m[0]] = true;
      }
    }
    // Scan body text
    if (article.body) {
      for (var j = 0; j < article.body.length; j++) {
        var matches = article.body[j].match(ZIP_RE);
        if (matches) {
          for (var k = 0; k < matches.length; k++) zips[matches[k]] = true;
        }
      }
    }
    return Object.keys(zips);
  }

  function extractShopNames(article) {
    var market = window.RE_UP_MARKET;
    if (!market || !market.COMPETITORS) return [];
    var found = {};
    var bodyText = '';
    if (article.body) bodyText = article.body.join(' ');
    var tagText = (article.tags || []).join(' ');
    var searchText = (bodyText + ' ' + tagText).toLowerCase();

    for (var i = 0; i < market.COMPETITORS.length; i++) {
      var shop = market.COMPETITORS[i];
      if (searchText.indexOf(shop.name.toLowerCase()) !== -1) {
        found[shop.name] = shop;
      }
    }
    // Also match partial names from tags (e.g. "midwood-barbers" -> "Midwood Barbers")
    if (article.tags) {
      for (var t = 0; t < article.tags.length; t++) {
        var tagNorm = article.tags[t].replace(/-/g, ' ').toLowerCase();
        for (var c = 0; c < market.COMPETITORS.length; c++) {
          var cn = market.COMPETITORS[c].name.toLowerCase();
          if (cn.indexOf(tagNorm) !== -1 || tagNorm.indexOf(cn.split(' ').slice(0,2).join(' ').toLowerCase()) !== -1) {
            found[market.COMPETITORS[c].name] = market.COMPETITORS[c];
          }
        }
      }
    }
    var results = [];
    for (var name in found) results.push(found[name]);
    return results;
  }

  function buildMarketContext(article) {
    var market = window.RE_UP_MARKET;
    if (!market) return '';

    var zips = extractZipCodes(article);
    var shops = extractShopNames(article);

    if (zips.length === 0 && shops.length === 0) return '';

    var html = '<aside class="article-market-context">' +
      '<h3 class="market-context-title">Market Context</h3>';

    // Zip code cards
    if (zips.length > 0) {
      html += '<div class="market-context-zips">';
      for (var i = 0; i < zips.length; i++) {
        var zipData = market.findZip(zips[i]);
        if (!zipData) continue;
        var priceStr = '';
        if (typeof zipData.haircut === 'number') {
          var diff = zipData.haircut - market.cityAvgHaircut;
          var sign = diff >= 0 ? '+' : '';
          priceStr = 'Avg cut: $' + zipData.haircut +
            ' <span class="context-vs">(' + sign + '$' + Math.abs(diff) + ' vs city avg)</span>';
        } else {
          priceStr = 'Avg cut: No data';
        }
        html += '<div class="context-zip-card">' +
          '<span class="context-zip">' + escapeHtml(zipData.zip) + '</span>' +
          '<span class="context-area">' + escapeHtml(zipData.area) + '</span>' +
          '<span class="context-price">' + priceStr + '</span>' +
          '<span class="context-shops">' + zipData.shops + ' shops tracked</span>' +
        '</div>';
      }
      html += '</div>';
    }

    // Shop cards
    if (shops.length > 0) {
      html += '<div class="market-context-shops">';
      for (var s = 0; s < shops.length; s++) {
        var shop = shops[s];
        var priceLabel = typeof shop.avgCut === 'number' ? '$' + shop.avgCut : 'N/A';
        var ratingLabel = typeof shop.rating === 'number' ? shop.rating + '\u2605' : 'N/A';
        html += '<div class="context-shop-card">' +
          '<span class="context-shop-name">' + escapeHtml(shop.name) + '</span>' +
          '<span class="context-shop-meta">' + priceLabel + ' \u00b7 ' + ratingLabel + ' \u00b7 ' + escapeHtml(shop.model) + '</span>' +
        '</div>';
      }
      html += '</div>';
    }

    html += '<a href="dashboard.html#section-pricing" class="context-cta">View full market data \u2192</a>';
    html += '</aside>';
    return html;
  }

  // ---- Playbook / Outlook rendering ----

  function buildPlaybook(outlook) {
    if (!outlook) return '';

    // New playbook format (has actions array)
    if (outlook.actions && outlook.actions.length) {
      var html = '<div class="article-playbook">' +
        '<h3 class="playbook-title">\ud83d\udccb Your Playbook</h3>';

      if (outlook.summary) {
        html += '<div class="playbook-summary">' +
          '<h4>What Happened</h4>' +
          '<p>' + escapeHtml(outlook.summary) + '</p>' +
        '</div>';
      }

      if (outlook.impact) {
        html += '<div class="playbook-impact">' +
          '<h4>Why It Matters</h4>' +
          '<p>' + escapeHtml(outlook.impact) + '</p>' +
        '</div>';
      }

      html += '<div class="playbook-actions">' +
        '<h4>What To Do</h4>' +
        '<ul>';
      for (var i = 0; i < outlook.actions.length; i++) {
        html += '<li>' + escapeHtml(outlook.actions[i]) + '</li>';
      }
      html += '</ul></div>';

      if (outlook.watchFor) {
        html += '<div class="playbook-watch">' +
          '<h4>Watch For</h4>' +
          '<p>' + escapeHtml(outlook.watchFor) + '</p>' +
        '</div>';
      }

      html += '</div>';
      return html;
    }

    // Backward compatibility: old outlook.text format
    if (outlook.text) {
      return '<div class="article-outlook">' +
        '<div class="article-outlook-header">' +
          '<span class="article-outlook-icon">\u2192</span>' +
          '<span class="article-outlook-timeframe">How This Affects You: ' + escapeHtml(outlook.timeframe) + '</span>' +
        '</div>' +
        '<p class="article-outlook-text">' + escapeHtml(outlook.text) + '</p>' +
      '</div>';
    }

    return '';
  }

  // ---- Related Data Cards ----

  function buildRelatedData(article) {
    var cards = [];
    var zips = extractZipCodes(article);
    var shops = extractShopNames(article);
    var tagStr = (article.tags || []).join(' ');
    var desk = article.desk || '';

    // Zip-related
    if (zips.length > 0) {
      cards.push({
        href: 'dashboard.html#section-pricing',
        icon: '\ud83d\udcca',
        label: 'Pricing by Zip Code',
        desc: 'See how prices compare across 14 Charlotte zip codes'
      });
    }

    // Shop-related
    if (shops.length > 0) {
      cards.push({
        href: 'dashboard.html#section-competitors',
        icon: '\ud83c\udfe2',
        label: 'Competitor Directory',
        desc: 'View all tracked shops with pricing, ratings, and models'
      });
    }

    // Pricing/trends articles
    if (tagStr.indexOf('pricing') !== -1 || tagStr.indexOf('market-trends') !== -1 || tagStr.indexOf('revenue') !== -1) {
      cards.push({
        href: 'dashboard.html#section-heatmap',
        icon: '\ud83d\uddfa\ufe0f',
        label: 'Pricing Heat Map',
        desc: 'Visualize pricing patterns across Charlotte neighborhoods'
      });
    }

    // Social media articles
    if (tagStr.indexOf('social-media') !== -1 || tagStr.indexOf('instagram') !== -1 || tagStr.indexOf('tiktok') !== -1) {
      cards.push({
        href: 'dashboard.html#section-social',
        icon: '\ud83d\udcf1',
        label: 'Social Leaderboard',
        desc: 'See which Charlotte shops lead on social media'
      });
    }

    // Events desk
    if (desk === 'clt-events') {
      if (cards.length < 3) {
        cards.push({
          href: 'dashboard.html#section-pricing',
          icon: '\ud83c\udfab',
          label: 'Event Impact on Pricing',
          desc: 'Track how major events affect barbershop demand'
        });
      }
    }

    // Supply chain desk
    if (desk === 'supply-chain') {
      if (cards.length < 3) {
        cards.push({
          href: 'dashboard.html#section-competitors',
          icon: '\u2699\ufe0f',
          label: 'Shop Equipment Profiles',
          desc: 'See what models and tiers Charlotte shops operate in'
        });
      }
    }

    // De-duplicate by href
    var seen = {};
    var unique = [];
    for (var i = 0; i < cards.length && unique.length < 3; i++) {
      if (!seen[cards[i].href + cards[i].label]) {
        seen[cards[i].href + cards[i].label] = true;
        unique.push(cards[i]);
      }
    }

    if (unique.length === 0) return '';

    var html = '<div class="article-related-data">' +
      '<h3>Dive Deeper</h3>' +
      '<div class="related-data-grid">';

    for (var j = 0; j < unique.length; j++) {
      var c = unique[j];
      html += '<a href="' + c.href + '" class="related-data-card">' +
        '<span class="related-data-icon">' + c.icon + '</span>' +
        '<span class="related-data-label">' + escapeHtml(c.label) + '</span>' +
        '<span class="related-data-desc">' + escapeHtml(c.desc) + '</span>' +
      '</a>';
    }

    html += '</div></div>';
    return html;
  }

  // ---- Tag Deep Links ----

  function buildTagLink(tag) {
    // Zip code tags → heat map
    if (/^282\d{2}$/.test(tag)) {
      return 'dashboard.html#section-heatmap';
    }
    // Check if tag matches a shop name (normalized)
    if (window.RE_UP_MARKET && window.RE_UP_MARKET.COMPETITORS) {
      var tagNorm = tag.replace(/-/g, ' ').toLowerCase();
      for (var i = 0; i < window.RE_UP_MARKET.COMPETITORS.length; i++) {
        var shopName = window.RE_UP_MARKET.COMPETITORS[i].name.toLowerCase();
        if (shopName.indexOf(tagNorm) !== -1) {
          return 'dashboard.html#section-competitors';
        }
      }
    }
    // General tags → filtered news feed
    return '../index.html#news-section';
  }

  function buildTags(article) {
    if (!article.tags || !article.tags.length) return '';
    var html = '<div class="article-tags">';
    for (var t = 0; t < article.tags.length; t++) {
      var tag = article.tags[t];
      var href = buildTagLink(tag);
      html += '<a href="' + href + '" class="article-tag article-tag--link">' + escapeHtml(tag) + '</a>';
    }
    html += '</div>';
    return html;
  }

  // ---- Paywall ----

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
              '<div class="paywall-plan-name">Intel Monthly <span class="reup-coming-soon">Coming Soon</span></div>' +
              '<div class="paywall-plan-price"><span class="paywall-currency">$</span>9<span class="paywall-period">/mo</span></div>' +
              '<ul class="paywall-plan-includes">' +
                '<li>Full articles &amp; outlook briefs</li>' +
                '<li>Charlotte market dashboard</li>' +
                '<li>Weekly email intel digest</li>' +
              '</ul>' +
              '<button class="btn btn-primary paywall-cta" data-plan="monthly">Join the Waitlist</button>' +
            '</div>' +
            '<div class="paywall-plan paywall-plan--featured">' +
              '<div class="paywall-plan-badge">Best Value</div>' +
              '<div class="paywall-plan-name">Intel Annual <span class="reup-coming-soon">Coming Soon</span></div>' +
              '<div class="paywall-plan-price"><span class="paywall-currency">$</span>79<span class="paywall-period">/yr</span></div>' +
              '<div class="paywall-plan-savings">Save $29 vs monthly</div>' +
              '<ul class="paywall-plan-includes">' +
                '<li>Everything in Monthly</li>' +
                '<li>Quarterly market reports</li>' +
                '<li>Priority access to new tools</li>' +
              '</ul>' +
              '<button class="btn btn-primary paywall-cta" data-plan="annual">Join the Waitlist</button>' +
            '</div>' +
          '</div>' +

          '<p class="paywall-note">Subscriptions launching soon. Built by barbers, for barbers.</p>' +

        '</div>' +
      '</div>';
  }

  // ---- Main Render ----

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

    // Impact badge with deep link
    var impactHtml = '';
    if (article.impact && article.impact !== 'low') {
      var cls = article.impact === 'high' ? 'news-impact--high' : 'news-impact--medium';
      impactHtml = '<span class="news-impact ' + cls + '">' + escapeHtml(article.impact.toUpperCase()) + ' IMPACT</span>';
    }

    // Body paragraphs — split into teaser (1st para) and gated (rest)
    var teaserHtml = '';
    var gatedHtml = '';
    if (article.body && article.body.length) {
      teaserHtml = '<p>' + sanitizeHtml(article.body[0]) + '</p>';
      for (var i = 1; i < article.body.length; i++) {
        gatedHtml += '<p>' + sanitizeHtml(article.body[i]) + '</p>';
      }
    } else {
      teaserHtml = '<p>' + sanitizeHtml(article.summary) + '</p>';
    }

    // Playbook / Outlook section
    var playbookHtml = buildPlaybook(article.outlook);

    // Market context sidebar (subscriber-only)
    var marketContextHtml = buildMarketContext(article);

    // Related data cards (subscriber-only)
    var relatedDataHtml = buildRelatedData(article);

    // Tags with deep links
    var tagsHtml = buildTags(article);

    // Build the full article HTML
    var html =
      '<article class="article-full' + (unlocked && marketContextHtml ? ' article-full--with-sidebar' : '') + '">' +
        '<a href="../index.html#news-section" class="article-back">&larr; Back to News</a>' +
        '<div class="article-meta">' +
          '<span class="news-tag ' + meta.tagClass + '">' + escapeHtml(meta.label) + '</span>' +
          impactHtml +
        '</div>' +
        '<h1 class="article-headline">' + escapeHtml(article.title) + '</h1>' +
        '<div class="article-info">' +
          '<span class="article-byline">' + escapeHtml(article.byline || article.source) + '</span>' +
          '<span class="article-date">' + escapeHtml(formatDate(article.date)) + '</span>' +
        '</div>';

    if (unlocked) {
      // Full access — show everything
      html += '<div class="article-content-wrapper">' +
        '<div class="article-body-column">' +
          '<div class="article-body">' +
            teaserHtml +
            gatedHtml +
          '</div>' +
          playbookHtml +
          relatedDataHtml +
          tagsHtml +
        '</div>' +
        marketContextHtml +
      '</div>';
    } else {
      // Gated — show blurred preview + paywall
      html +=
        '<div class="article-body">' +
          teaserHtml +
        '</div>' +
        '<div class="article-gated-preview">' +
          '<div class="article-gated-blur">' + gatedHtml + playbookHtml + '</div>' +
        '</div>' +
        buildPaywall() +
        tagsHtml;
    }

    html += '</article>';
    container.innerHTML = html;

    // Attach CTA handlers — show inline waitlist form
    if (!unlocked) {
      var buttons = container.querySelectorAll('.paywall-cta');
      for (var b = 0; b < buttons.length; b++) {
        buttons[b].addEventListener('click', function () {
          var btn = this;
          var formContainer = document.createElement('div');
          btn.parentNode.replaceChild(formContainer, btn);
          window.showWaitlistForm(formContainer);
        });
      }
    }
    }); // end checkAccess callback
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
