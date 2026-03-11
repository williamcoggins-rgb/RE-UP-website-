/* ============================================================
   RE UP Report — Newsroom Feed Consumer

   Data loading priority:
   1. Try fetching data/exports/newsroom.json (server/local dev)
   2. Fall back to embedded NEWSROOM_FEED (always ships with deploy)

   Desk-to-filter mapping:
     all          → everything
     clt-local    → Charlotte Local
     national-biz → National Barber Business
     supply-chain → Supply Chain
     clt-events   → Charlotte Events
   ============================================================ */

(function () {
  // Desk metadata for rendering
  var DESK_META = {
    'clt-local':    { tagClass: 'news-tag--charlotte', label: 'CLT Local' },
    'national-biz': { tagClass: 'news-tag--national',  label: 'National' },
    'supply-chain': { tagClass: 'news-tag--supply',    label: 'Supply Chain' },
    'clt-events':   { tagClass: 'news-tag--events',    label: 'CLT Events' }
  };

  // --- Embedded feed (updated by newsroom/run.js) ---
  // Ensures the site always has stories even when data/ is gitignored.
  var NEWSROOM_FEED = [
    {
      id: "3c4a8e767d3b", desk: "clt-local",
      title: "The ultimate guide to Charlotte\u2019s barbers",
      summary: "Comprehensive guide covering the best barbers and barbershops in Charlotte, from South End to West Charlotte \u2014 featuring Lucky Spot, No Grease, The CUT, and Charlotte Barber & Beard.",
      url: "https://www.qcitymetro.com/2025/07/29/barbers-in-charlotte/",
      source: "QCity Metro", date: "2025-07-29", score: 60, impact: "medium",
      tags: ["guide","no-grease","lucky-spot","the-cut"]
    },
    {
      id: "031dacc59143", desk: "national-biz",
      title: "Beloved Black-owned barbershop No Grease turns 25",
      summary: "Profile of No Grease on its 25th anniversary, covering its growth from one shop in 1997 to 13 locations, a barber school, and a $2.5M crowdfunding campaign for expansion.",
      url: "https://www.axios.com/local/charlotte/2022/06/17/beloved-black-owned-barbershop-no-grease-turns-25-300689",
      source: "Axios Charlotte", date: "2022-06-17", score: 60, impact: "medium",
      tags: ["no-grease","franchise","growth","crowdfunding"]
    },
    {
      id: "c269ed0b65d8", desk: "clt-local",
      title: "Community leaders call for action after man shot, killed outside Charlotte barbershop",
      summary: "A man was shot and killed outside a barbershop on Trinity Road near Beatties Ford Road. Community leaders described the area as a \"sacred space\" and called the shooting senseless. CMPD investigated its 83rd homicide of the year.",
      url: "https://www.wbtv.com/2025/12/18/community-leaders-call-action-after-man-shot-killed-outside-charlotte-barbershop/",
      source: "WBTV", date: "2025-12-18", score: 54, impact: "medium",
      tags: ["safety","beatties-ford","community","cmpd"]
    },
    {
      id: "4e851efeb71a", desk: "clt-local",
      title: "'Heart-wrenching': 1 shot, killed at strip mall known for community gatherings",
      summary: "Coverage of the fatal shooting outside the Trinity Road barbershop, emphasizing the strip mall's role as a community gathering place in north Charlotte.",
      url: "https://www.wsoctv.com/news/local/1-shot-killed-strip-mall-north-charlotte/Q5YM6FXWUJBOTPEAIAR7TQTQNI/",
      source: "WSOC-TV", date: "2025-12-18", score: 54, impact: "medium",
      tags: ["safety","trinity-road","community"]
    },
    {
      id: "04e6b4ed64bf", desk: "clt-local",
      title: "SouthPark Mall reverses course, allows No Grease barbershop to remain",
      summary: "After 24 hours of community backlash, SouthPark Mall reversed its decision to terminate No Grease's lease 9 months early, allowing the Black-owned barbershop to stay.",
      url: "https://www.wcnc.com/article/news/local/no-grease-barbershop-southpark-mall-charlotte-lease-terminated/275-c08e938a-cc7e-4538-bbab-92cf882a1003",
      source: "WCNC", date: "2021-03-03", score: 51, impact: "medium",
      tags: ["no-grease","southpark","lease","community-pressure"]
    },
    {
      id: "693aa46bf196", desk: "national-biz",
      title: "SouthPark shift: After calls to protest, the mall will keep No Grease",
      summary: "Community pressure reversed SouthPark Mall's decision to terminate No Grease's lease early \u2014 a case study in how Black-owned barbershops navigate commercial real estate.",
      url: "https://www.axios.com/local/charlotte/2021/03/03/southpark-mall-terminates-no-greases-lease-9-months-early-249814",
      source: "Axios Charlotte", date: "2021-03-03", score: 51, impact: "medium",
      tags: ["no-grease","real-estate","lease","black-owned"]
    },
    {
      id: "2be320ebdb7b", desk: "clt-local",
      title: "A New Partnership with No Grease Barbershop",
      summary: "No Grease partnered with the Center for Community Transitions to provide free haircuts to clients preparing for job interviews using vouchers at their barber schools.",
      url: "https://centerforcommunitytransitions.org/news-blog/a-new-partnership-with-no-grease-barbershop/",
      source: "Center for Community Transitions", date: "2025-06-01", score: 45, impact: "medium",
      tags: ["no-grease","community","workforce","partnership"]
    },
    {
      id: "c6f74753797b", desk: "clt-events",
      title: "Lucky Spot Barbershop 15th Annual Back to School Weekend",
      summary: "Lucky Spot Barbershop's 15th annual community event in partnership with Cops & Barbers, featuring free haircuts at Charlotte-area Walmart locations.",
      url: "https://www.eventbrite.com/e/lucky-spot-barbershop-15th-annual-back-to-school-weekend-charlotte-tickets-1583583393559",
      source: "Eventbrite", date: "2025-08-24", score: 45, impact: "medium",
      tags: ["event","back-to-school","lucky-spot","free-haircuts"]
    },
    {
      id: "c8d4de3854ac", desk: "clt-local",
      title: "No Grease barber shop owner arrested, accused of hiding suspect during police chase",
      summary: "Jermaine Johnson, 52, co-owner of No Grease, was charged with harboring a fugitive after a former barber school student hid inside the business during a police chase.",
      url: "https://www.charlottealertsnews.com/news/no-grease-barber-shop-owner-arrested-accused-of-hiding-suspect-in-barber-shop-during-chase/",
      source: "Charlotte Alerts News", date: "2025-11-21", score: 36, impact: "low",
      tags: ["no-grease","arrest","barber-school"]
    },
    {
      id: "f3db0b4a9699", desk: "clt-local",
      title: "ICE raids Latino barber shop Dr Stylo on Albemarle Road",
      summary: "Border Patrol agents raided Dr Stylo, a Latino barbershop on Albemarle Road, as part of broader immigration enforcement operations in Charlotte, causing fear in the Latino community.",
      url: "https://www.charlottealertsnews.com/news/video-ice-raids-latino-barber-shop-dr-stylo-on-albemarle-road-driving-kia-suv/",
      source: "Charlotte Alerts News", date: "2025-11-19", score: 36, impact: "low",
      tags: ["ice","immigration","albemarle-road","latino"]
    },
    {
      id: "87fe98187df8", desk: "clt-events",
      title: "Carolina Barber Expo 2025",
      summary: "Regional barber expo featuring barber battles, live demonstrations, and networking. Charlotte-area barbers and educators participating.",
      url: "https://www.eventbrite.com/e/carolina-barber-expo-2025-tickets-1298600632449",
      source: "Eventbrite", date: "2025-09-07", score: 28, impact: "low",
      tags: ["event","expo","networking","education"]
    }
  ];

  var cachedArticles = [];

  // Detect base path (works from / and /pages/)
  function getApiBase() {
    var loc = window.location.pathname;
    if (loc.indexOf('/pages/') !== -1) return '../';
    return './';
  }

  // Try fetching live feed, fall back to embedded data
  function loadArticles() {
    var base = getApiBase();
    return fetch(base + 'data/exports/newsroom.json')
      .then(function (res) {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(function (feed) {
        return feed.articles || [];
      })
      .catch(function () {
        // Deployed without data/ — use embedded feed
        return NEWSROOM_FEED;
      });
  }

  // Render an impact badge
  function impactBadge(impact) {
    if (!impact || impact === 'low') return '';
    var cls = impact === 'high' ? 'news-impact--high' : 'news-impact--medium';
    return '<span class="news-impact ' + cls + '">' + impact.toUpperCase() + '</span>';
  }

  // Render articles into the grid
  function renderNewsCards(articles) {
    var grid = document.getElementById('news-grid');
    if (!grid) return;

    if (articles.length === 0) {
      grid.innerHTML = '<div class="news-empty">No stories from this desk yet.</div>';
      return;
    }

    var html = '';
    for (var i = 0; i < articles.length; i++) {
      var a = articles[i];
      var meta = DESK_META[a.desk] || { tagClass: 'news-tag--charlotte', label: a.desk };

      // Format date nicely
      var displayDate = a.date || '';
      try {
        var d = new Date(a.date);
        if (!isNaN(d.getTime())) {
          displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
      } catch (e) { /* keep raw */ }

      html +=
        '<div class="news-card" data-desk="' + a.desk + '" data-score="' + (a.score || 0) + '">' +
          '<div class="news-card-header">' +
            '<span class="news-tag ' + meta.tagClass + '">' + meta.label + '</span>' +
            '<span class="news-date">' + displayDate + '</span>' +
          '</div>' +
          '<h3 class="news-title">' + escapeHtml(a.title) + '</h3>' +
          '<p class="news-summary">' + escapeHtml(a.summary) + '</p>' +
          '<div class="news-source">' +
            '<span>' + escapeHtml(a.source) + '</span>' +
            ' &middot; ' +
            '<a href="' + encodeURI(a.url) + '" target="_blank" rel="noopener noreferrer">Read article</a>' +
            impactBadge(a.impact) +
          '</div>' +
        '</div>';
    }

    grid.innerHTML = html;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  // Apply the current filter to cached articles
  function applyFilter(filter) {
    var filtered = filter === 'all'
      ? cachedArticles
      : cachedArticles.filter(function (a) { return a.desk === filter; });
    renderNewsCards(filtered);
  }

  // Wire up filter tabs
  function initNewsTabs() {
    var tabs = document.querySelectorAll('[data-news-filter]');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', function () {
        var siblings = this.parentElement.querySelectorAll('.news-tab');
        for (var j = 0; j < siblings.length; j++) {
          siblings[j].classList.remove('active');
        }
        this.classList.add('active');
        applyFilter(this.getAttribute('data-news-filter'));
      });
    }
  }

  function init() {
    loadArticles().then(function (articles) {
      cachedArticles = articles;
      applyFilter('all');
    });
    initNewsTabs();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
