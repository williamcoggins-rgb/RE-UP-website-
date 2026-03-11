/* ============================================================
   RE UP Newsroom — Charlotte Local Desk
   Beat: What's happening in and around Charlotte barbershops
   Sources: WBTV, WSOC, WCNC, WFAE, QCity Metro, Charlotte Alerts
   ============================================================ */

var BaseDesk = require('./base-desk');

function CltLocalDesk() {
  BaseDesk.call(this, 'clt-local');
}
CltLocalDesk.prototype = Object.create(BaseDesk.prototype);
CltLocalDesk.prototype.constructor = CltLocalDesk;

// Verified seed stories — these are real, sourced articles
CltLocalDesk.prototype.SEED_STORIES = [
  {
    title: 'Community leaders call for action after man shot, killed outside Charlotte barbershop',
    summary: 'A man was shot and killed outside a barbershop on Trinity Road near Beatties Ford Road. Community leaders described the area as a "sacred space" and called the shooting senseless. CMPD investigated its 83rd homicide of the year.',
    url: 'https://www.wbtv.com/2025/12/18/community-leaders-call-action-after-man-shot-killed-outside-charlotte-barbershop/',
    source: 'WBTV',
    date: '2025-12-18',
    tags: ['safety', 'beatties-ford', 'community', 'cmpd']
  },
  {
    title: "'Heart-wrenching': 1 shot, killed at strip mall known for community gatherings",
    summary: 'Coverage of the fatal shooting outside the Trinity Road barbershop, emphasizing the strip mall\'s role as a community gathering place in north Charlotte.',
    url: 'https://www.wsoctv.com/news/local/1-shot-killed-strip-mall-north-charlotte/Q5YM6FXWUJBOTPEAIAR7TQTQNI/',
    source: 'WSOC-TV',
    date: '2025-12-18',
    tags: ['safety', 'trinity-road', 'community']
  },
  {
    title: 'No Grease barber shop owner arrested, accused of hiding suspect during police chase',
    summary: 'Jermaine Johnson, 52, co-owner of No Grease, was charged with harboring a fugitive after a former barber school student hid inside the business during a police chase.',
    url: 'https://www.charlottealertsnews.com/news/no-grease-barber-shop-owner-arrested-accused-of-hiding-suspect-in-barber-shop-during-chase/',
    source: 'Charlotte Alerts News',
    date: '2025-11-21',
    tags: ['no-grease', 'arrest', 'barber-school']
  },
  {
    title: 'ICE raids Latino barber shop Dr Stylo on Albemarle Road',
    summary: 'Border Patrol agents raided Dr Stylo, a Latino barbershop on Albemarle Road, as part of broader immigration enforcement operations in Charlotte, causing fear in the Latino community.',
    url: 'https://www.charlottealertsnews.com/news/video-ice-raids-latino-barber-shop-dr-stylo-on-albemarle-road-driving-kia-suv/',
    source: 'Charlotte Alerts News',
    date: '2025-11-19',
    tags: ['ice', 'immigration', 'albemarle-road', 'latino']
  },
  {
    title: "The ultimate guide to Charlotte's barbers",
    summary: 'Comprehensive guide covering the best barbers and barbershops in Charlotte, from South End to West Charlotte — featuring Lucky Spot, No Grease, The CUT, and Charlotte Barber & Beard.',
    url: 'https://www.qcitymetro.com/2025/07/29/barbers-in-charlotte/',
    source: 'QCity Metro',
    date: '2025-07-29',
    tags: ['guide', 'no-grease', 'lucky-spot', 'the-cut']
  },
  {
    title: 'A New Partnership with No Grease Barbershop',
    summary: 'No Grease partnered with the Center for Community Transitions to provide free haircuts to clients preparing for job interviews using vouchers at their barber schools.',
    url: 'https://centerforcommunitytransitions.org/news-blog/a-new-partnership-with-no-grease-barbershop/',
    source: 'Center for Community Transitions',
    date: '2025-06-01',
    tags: ['no-grease', 'community', 'workforce', 'partnership']
  },
  {
    title: 'SouthPark Mall reverses course, allows No Grease barbershop to remain',
    summary: 'After 24 hours of community backlash, SouthPark Mall reversed its decision to terminate No Grease\'s lease 9 months early, allowing the Black-owned barbershop to stay.',
    url: 'https://www.wcnc.com/article/news/local/no-grease-barbershop-southpark-mall-charlotte-lease-terminated/275-c08e938a-cc7e-4538-bbab-92cf882a1003',
    source: 'WCNC',
    date: '2021-03-03',
    tags: ['no-grease', 'southpark', 'lease', 'community-pressure']
  }
];

CltLocalDesk.prototype.gather = function () {
  var self = this;

  // Start with verified seed stories
  var stories = self.SEED_STORIES.slice();

  // If a web search adapter is configured, search for fresh stories
  // This is the extension point — plug in a search API here
  var searchAdapter = require('../adapters/web-search');
  if (searchAdapter.isConfigured()) {
    var searches = self.queries.map(function (q) {
      return searchAdapter.search(q).then(function (results) {
        return results.map(function (r) {
          r.tags = r.tags || ['charlotte', 'local'];
          return r;
        });
      });
    });
    return Promise.all(searches).then(function (resultSets) {
      resultSets.forEach(function (set) {
        stories = stories.concat(set);
      });
      return stories;
    });
  }

  return Promise.resolve(stories);
};

module.exports = CltLocalDesk;
