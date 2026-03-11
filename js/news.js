/* ============================================================
   RE UP Report — Industry News
   All articles verified from real news sources.
   No fabricated headlines or URLs.
   ============================================================ */

(function () {
  var NEWS_ARTICLES = [
    {
      category: "charlotte",
      title: "Community leaders call for action after man shot, killed outside Charlotte barbershop",
      summary: "A man was shot and killed outside a barbershop on Trinity Road near Beatties Ford Road. Community leaders described the area as a \"sacred space\" and called the shooting senseless.",
      source: "WBTV",
      url: "https://www.wbtv.com/2025/12/18/community-leaders-call-action-after-man-shot-killed-outside-charlotte-barbershop/",
      date: "Dec 18, 2025"
    },
    {
      category: "charlotte",
      title: "No Grease barber shop owner arrested, accused of hiding suspect during police chase",
      summary: "Jermaine Johnson, 52, co-owner of No Grease, was charged with harboring a fugitive after a former barber school student hid inside the business during a police chase.",
      source: "Charlotte Alerts News",
      url: "https://www.charlottealertsnews.com/news/no-grease-barber-shop-owner-arrested-accused-of-hiding-suspect-in-barber-shop-during-chase/",
      date: "Nov 21, 2025"
    },
    {
      category: "charlotte",
      title: "ICE raids Latino barber shop Dr Stylo on Albemarle Road",
      summary: "Border Patrol agents raided Dr Stylo, a Latino barbershop on Albemarle Road, as part of broader immigration enforcement operations in Charlotte, causing fear in the Latino community.",
      source: "Charlotte Alerts News",
      url: "https://www.charlottealertsnews.com/news/video-ice-raids-latino-barber-shop-dr-stylo-on-albemarle-road-driving-kia-suv/",
      date: "Nov 19, 2025"
    },
    {
      category: "charlotte",
      title: "The ultimate guide to Charlotte's barbers",
      summary: "A comprehensive guide to the best barbers and barbershops in Charlotte, covering shops from South End to West Charlotte including Lucky Spot, No Grease, The CUT, and Charlotte Barber & Beard.",
      source: "QCity Metro",
      url: "https://www.qcitymetro.com/2025/07/29/barbers-in-charlotte/",
      date: "Jul 29, 2025"
    },
    {
      category: "charlotte",
      title: "Lucky Spot Barbershop 15th Annual Back to School Weekend",
      summary: "Lucky Spot Barbershop's 15th annual community event in partnership with Cops & Barbers, featuring free haircuts at Charlotte-area Walmart locations for back-to-school season.",
      source: "Eventbrite",
      url: "https://www.eventbrite.com/e/lucky-spot-barbershop-15th-annual-back-to-school-weekend-charlotte-tickets-1583583393559",
      date: "Aug 24, 2025"
    },
    {
      category: "charlotte",
      title: "A New Partnership with No Grease Barbershop",
      summary: "No Grease partnered with the Center for Community Transitions to provide free haircuts to clients preparing for job interviews using special vouchers at their barber schools.",
      source: "Center for Community Transitions",
      url: "https://centerforcommunitytransitions.org/news-blog/a-new-partnership-with-no-grease-barbershop/",
      date: "2025"
    },
    {
      category: "tech",
      title: "Carolina Barber Expo 2025",
      summary: "Regional barber expo featuring barber battles, live demonstrations, and networking, held at House of Blues Myrtle Beach with Charlotte-area barbers and educators participating.",
      source: "Eventbrite",
      url: "https://www.eventbrite.com/e/carolina-barber-expo-2025-tickets-1298600632449",
      date: "Sep 7, 2025"
    }
  ];

  function renderNewsCards(filter) {
    var grid = document.getElementById("news-grid");
    if (!grid) return;

    var articles = filter === "all"
      ? NEWS_ARTICLES
      : NEWS_ARTICLES.filter(function (a) { return a.category === filter; });

    if (articles.length === 0) {
      grid.innerHTML = '<div class="news-empty">No articles in this category yet.</div>';
      return;
    }

    var html = "";
    for (var i = 0; i < articles.length; i++) {
      var a = articles[i];
      var tagClass = a.category === "charlotte" ? "news-tag--charlotte"
        : a.category === "tech" ? "news-tag--tech"
        : "news-tag--industry";
      var tagLabel = a.category === "charlotte" ? "Charlotte"
        : a.category === "tech" ? "Barber Tech"
        : "Industry";

      html +=
        '<div class="news-card">' +
          '<div class="news-card-header">' +
            '<span class="news-tag ' + tagClass + '">' + tagLabel + '</span>' +
            '<span class="news-date">' + a.date + '</span>' +
          '</div>' +
          '<h3 class="news-title">' + a.title + '</h3>' +
          '<p class="news-summary">' + a.summary + '</p>' +
          '<div class="news-source">' +
            '<span>' + a.source + '</span>' +
            ' &middot; ' +
            '<a href="' + a.url + '" target="_blank" rel="noopener noreferrer">Read article</a>' +
          '</div>' +
        '</div>';
    }

    grid.innerHTML = html;
  }

  function initNewsTabs() {
    var tabs = document.querySelectorAll("[data-news-filter]");
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener("click", function () {
        var siblings = this.parentElement.querySelectorAll(".news-tab");
        for (var j = 0; j < siblings.length; j++) {
          siblings[j].classList.remove("active");
        }
        this.classList.add("active");
        renderNewsCards(this.getAttribute("data-news-filter"));
      });
    }
  }

  function init() {
    renderNewsCards("all");
    initNewsTabs();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
