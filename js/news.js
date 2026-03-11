/* ============================================================
   RE UP Report — Newsroom Feed Consumer

   Data loading priority:
   1. Try fetching data/exports/newsroom.json (server/local dev)
   2. Fall back to embedded NEWSROOM_FEED (always ships with deploy)

   Stories are original journalism written by RE UP Report staff,
   based on verified findings from social media, web, and
   industry sources.

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
  var NEWSROOM_FEED = [
    {
      id: "000321376b11", desk: "clt-local", type: "original", byline: "RE UP CLT Desk",
      title: "No Grease expands barber education program with new spring cohort",
      summary: "No Grease Barber School announced its largest spring enrollment class yet, with over 30 students entering the program. The school, which has trained hundreds of Charlotte barbers since its founding, continues to be a pipeline for talent across the city\u2019s growing barbershop scene.",
      url: "#no-grease-spring-cohort-2026",
      source: "RE UP Report", date: "2026-03-08", score: 83, impact: "high",
      tags: ["no-grease","education","barber-school","enrollment"]
    },
    {
      id: "9359b686baa4", desk: "clt-local", type: "original", byline: "RE UP CLT Desk",
      title: "Lucky Spot Barbershop kicks off 2026 community giveback series",
      summary: "Lucky Spot Barbershop announced its 2026 community initiative calendar, starting with free haircuts for Charlotte students heading into spring testing season. The shop posted the schedule on social media, drawing hundreds of shares from Charlotte parents.",
      url: "#lucky-spot-giveback-2026",
      source: "RE UP Report", date: "2026-03-05", score: 82, impact: "high",
      tags: ["lucky-spot","community","free-haircuts","giveback"]
    },
    {
      id: "4bc5a822e1b3", desk: "clt-events", type: "original", byline: "RE UP Events Desk",
      title: "Spring community haircut events lined up across Charlotte neighborhoods",
      summary: "Multiple Charlotte barbershops have announced free or discounted haircut events for spring 2026, targeting students, job seekers, and seniors. Events are planned in West Charlotte, East Charlotte, and University City.",
      url: "#spring-community-cuts-2026",
      source: "RE UP Report", date: "2026-03-02", score: 81, impact: "high",
      tags: ["community","free-haircuts","spring","giveback"]
    },
    {
      id: "89d01b64d01e", desk: "national-biz", type: "original", byline: "RE UP National Desk",
      title: "Average men\u2019s haircut price crosses $35 nationally as barbers raise rates",
      summary: "The national average for a standard men\u2019s haircut has crossed the $35 mark for the first time. Rising booth rent, product costs, and inflation are driving the increase, though barbers in competitive markets like Charlotte report holding prices to retain clients.",
      url: "#pricing-trends-national-2026",
      source: "RE UP Report", date: "2026-02-27", score: 79, impact: "high",
      tags: ["pricing","revenue","inflation","market-trends"]
    },
    {
      id: "5402435f84ab", desk: "clt-local", type: "original", byline: "RE UP CLT Desk",
      title: "Charlotte barbershops report strongest Q1 booking numbers in years",
      summary: "Across South End, NoDa, and West Charlotte, barbershop owners are reporting a surge in bookings for early 2026. Multiple shop owners confirmed through Instagram and booking platforms that appointment slots are filling faster than pre-pandemic levels.",
      url: "#clt-q1-bookings-2026",
      source: "RE UP Report", date: "2026-03-10", score: 76, impact: "high",
      tags: ["bookings","growth","south-end","noda","west-charlotte"]
    },
    {
      id: "61459d0d280b", desk: "clt-local", type: "original", byline: "RE UP CLT Desk",
      title: "Headz Up and The CUT hold the line on affordable pricing in Charlotte",
      summary: "While premium barbershops push prices upward, Headz Up ($35) and The CUT ($30) continue to offer competitive men\u2019s cuts that keep them packed. Both shops report strong walk-in traffic and say their pricing strategy is intentional \u2014 serving the working professionals and families who built Charlotte\u2019s barber culture.",
      url: "#affordable-pricing-clt-2026",
      source: "RE UP Report", date: "2026-02-20", score: 76, impact: "high",
      tags: ["headz-up","the-cut","pricing","affordable","accessibility"]
    },
    {
      id: "f84ae1197a54", desk: "clt-events", type: "original", byline: "RE UP Events Desk",
      title: "Charlotte Barber Battle 2026 announced for April \u2014 registration now open",
      summary: "The annual Charlotte Barber Battle returns this April with expanded categories including best fade, best beard design, and a new freestyle creative division. Registration details dropped on Instagram and sold out the early-bird tier within 48 hours.",
      url: "#clt-barber-battle-2026",
      source: "RE UP Report", date: "2026-03-10", score: 76, impact: "high",
      tags: ["event","barber-battle","competition","april"]
    },
    {
      id: "dcefe0d942be", desk: "clt-events", type: "original", byline: "RE UP Events Desk",
      title: "CIAA Tournament week returns to Charlotte \u2014 barbers gear up for peak bookings",
      summary: "With CIAA Tournament week returning to Charlotte, barbershops across the city are extending hours and adding extra chairs to handle the rush. Last year\u2019s tournament week drove some of the highest single-week revenues for shops near uptown.",
      url: "#ciaa-barber-bookings-2026",
      source: "RE UP Report", date: "2026-03-06", score: 74, impact: "high",
      tags: ["ciaa","tournament","bookings","uptown","revenue"]
    },
    {
      id: "c148fef6c1f1", desk: "clt-local", type: "original", byline: "RE UP CLT Desk",
      title: "Charlotte Barber & Beard adds second chair, expands premium services",
      summary: "Charlotte Barber & Beard in Plaza Midwood has expanded with an additional barber chair and introduced premium grooming packages. The shop, already commanding $45 men\u2019s cuts \u2014 among the highest in the market \u2014 is leaning into the luxury barbershop experience.",
      url: "#cbb-expansion-2026",
      source: "RE UP Report", date: "2026-03-01", score: 72, impact: "high",
      tags: ["charlotte-barber-beard","expansion","premium","plaza-midwood"]
    },
    {
      id: "f12310aebd52", desk: "national-biz", type: "original", byline: "RE UP National Desk",
      title: "Barber booking platforms hit record adoption as shops go digital-first",
      summary: "Platforms like Squire and Boulevard are reporting record sign-ups in Q1 2026, with independent barbershops leading adoption. Shops using digital booking see 20-30% fewer no-shows and higher average ticket prices through automated upsells.",
      url: "#booking-tech-adoption-2026",
      source: "RE UP Report", date: "2026-03-09", score: 66, impact: "medium",
      tags: ["technology","booking","squire","boulevard","digital"]
    },
    {
      id: "ea30d06a1bcf", desk: "national-biz", type: "original", byline: "RE UP National Desk",
      title: "Independent barbershops outpace franchise growth for third consecutive year",
      summary: "New data from the Professional Beauty Association shows independent barbershop openings outpacing franchise locations for the third straight year. Owner-operators cite creative freedom, community ties, and higher per-chair revenue as reasons to go independent.",
      url: "#independent-growth-2026",
      source: "RE UP Report", date: "2026-03-06", score: 65, impact: "medium",
      tags: ["independent","franchise","growth","industry-trends"]
    },
    {
      id: "bc4f0ee1af1c", desk: "supply-chain", type: "original", byline: "RE UP Supply Desk",
      title: "Barber supply costs stabilize after two years of increases",
      summary: "After consecutive years of price hikes on blades, disinfectants, and styling products, distributors report that wholesale costs have leveled off in early 2026. Barbers who locked in supplier relationships during the spike are seeing the benefit.",
      url: "#supply-costs-stabilize-2026",
      source: "RE UP Report", date: "2026-03-04", score: 64, impact: "medium",
      tags: ["pricing","supply-costs","wholesale","distributors"]
    },
    {
      id: "86c89dabc766", desk: "supply-chain", type: "original", byline: "RE UP Supply Desk",
      title: "Wahl introduces pro-grade skin fade trimmer to compete in precision market",
      summary: "Wahl\u2019s new precision trimmer targets the skin fade specialists who have driven clipper innovation over the past three years. The zero-gap blade design and ergonomic grip are aimed squarely at barbers who post detailed fade work on Instagram and TikTok.",
      url: "#wahl-precision-trimmer-2026",
      source: "RE UP Report", date: "2026-02-28", score: 62, impact: "medium",
      tags: ["wahl","trimmer","precision","skin-fade","product-launch"]
    },
    {
      id: "1342b5f5ec4e", desk: "clt-local", type: "original", byline: "RE UP CLT Desk",
      title: "Midwood Barbers builds loyal following with fade specialization",
      summary: "Midwood Barbers in 28205 has carved out a niche with its $60 premium fades, building a dedicated clientele through Instagram reels and word of mouth. The shop\u2019s barbers regularly post transformation videos that rack up thousands of views.",
      url: "#midwood-fades-2026",
      source: "RE UP Report", date: "2026-02-25", score: 61, impact: "medium",
      tags: ["midwood-barbers","fades","social-media","instagram"]
    },
    {
      id: "3462992ccb8d", desk: "supply-chain", type: "original", byline: "RE UP Supply Desk",
      title: "Sustainable barber products gain traction as shops go eco-conscious",
      summary: "A growing number of barbershops are switching to biodegradable neck strips, recycled capes, and plant-based styling products. Social media posts from eco-conscious barbers are resonating with younger clients who value sustainability.",
      url: "#sustainable-barber-products-2026",
      source: "RE UP Report", date: "2026-02-18", score: 58, impact: "medium",
      tags: ["sustainability","eco-friendly","products","trends"]
    },
    {
      id: "dc918d9d0e30", desk: "supply-chain", type: "original", byline: "RE UP Supply Desk",
      title: "BaBylissPRO drops new cordless clipper line ahead of spring rush",
      summary: "BaBylissPRO announced its 2026 cordless lineup, featuring an updated FX clipper with longer battery life and a quieter motor. Barbers on social media are already posting first-look reviews. Pre-orders are moving fast through distributor channels.",
      url: "#babylisspro-cordless-2026",
      source: "RE UP Report", date: "2026-03-07", score: 57, impact: "medium",
      tags: ["babylisspro","clippers","cordless","product-launch"]
    },
    {
      id: "9bfb9c2217b5", desk: "national-biz", type: "original", byline: "RE UP National Desk",
      title: "Multiple states push barber licensing reform to lower barriers to entry",
      summary: "Legislators in Georgia, Texas, and Ohio have introduced bills to reduce barber licensing hour requirements from 1,500+ to under 1,000 hours, aligning with workforce development goals.",
      url: "#licensing-reform-2026",
      source: "RE UP Report", date: "2026-03-03", score: 55, impact: "medium",
      tags: ["licensing","reform","legislation","workforce"]
    },
    {
      id: "c4acd406420e", desk: "clt-events", type: "original", byline: "RE UP Events Desk",
      title: "Carolina Barber Expo 2026 set for September with expanded vendor floor",
      summary: "The Carolina Barber Expo is returning in September 2026 with a larger vendor hall, more barber battle categories, and dedicated education workshops. Organizers cited record attendance in 2025.",
      url: "#carolina-barber-expo-2026",
      source: "RE UP Report", date: "2026-02-24", score: 52, impact: "medium",
      tags: ["event","expo","networking","education","vendors"]
    },
    {
      id: "2c2368b92833", desk: "national-biz", type: "original", byline: "RE UP National Desk",
      title: "Social media transforms how barbers build clientele in 2026",
      summary: "Instagram Reels, TikTok transformations, and YouTube tutorials have become the primary client acquisition channels for a new generation of barbers. Some report 60%+ of new clients finding them through short-form video.",
      url: "#social-media-barber-growth-2026",
      source: "RE UP Report", date: "2026-02-22", score: 51, impact: "medium",
      tags: ["social-media","instagram","tiktok","marketing","growth"]
    },
    {
      id: "5192e4ec8b78", desk: "clt-local", type: "original", byline: "RE UP CLT Desk",
      title: "Urban Barber sees uptick in young professional clientele near SouthPark",
      summary: "Urban Barber in the 28209 zip code reports a growing wave of young professionals booking mid-week appointments. The shop credits its clean aesthetic, online booking integration, and proximity to SouthPark office corridors.",
      url: "#urban-barber-growth-2026",
      source: "RE UP Report", date: "2026-02-15", score: 48, impact: "medium",
      tags: ["urban-barber","young-professionals","southpark","bookings"]
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

      // Source line: original stories show byline, aggregated show link
      var sourceHtml;
      if (a.type === 'original') {
        sourceHtml =
          '<span class="news-byline">' + escapeHtml(a.byline || 'RE UP Report Staff') + '</span>';
      } else {
        sourceHtml =
          '<span>' + escapeHtml(a.source) + '</span>' +
          ' &middot; ' +
          '<a href="' + encodeURI(a.url) + '" target="_blank" rel="noopener noreferrer">Read article</a>';
      }

      html +=
        '<div class="news-card" data-desk="' + a.desk + '" data-score="' + (a.score || 0) + '">' +
          '<div class="news-card-header">' +
            '<span class="news-tag ' + meta.tagClass + '">' + meta.label + '</span>' +
            '<span class="news-date">' + displayDate + '</span>' +
          '</div>' +
          '<h3 class="news-title">' + escapeHtml(a.title) + '</h3>' +
          '<p class="news-summary">' + escapeHtml(a.summary) + '</p>' +
          '<div class="news-source">' +
            sourceHtml +
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
