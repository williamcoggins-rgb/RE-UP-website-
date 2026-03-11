/* ============================================================
   RE UP Newsroom — Charlotte Events Desk
   Beat: Upcoming events that may affect barber income
   (concerts, sports, festivals, construction, conventions)
   Sources: Eventbrite, Charlotte Agenda, CRVA, local news
   ============================================================ */

var BaseDesk = require('./base-desk');

function CltEventsDesk() {
  BaseDesk.call(this, 'clt-events');
}
CltEventsDesk.prototype = Object.create(BaseDesk.prototype);
CltEventsDesk.prototype.constructor = CltEventsDesk;

CltEventsDesk.prototype.SEED_STORIES = [
  {
    title: 'Lucky Spot Barbershop 15th Annual Back to School Weekend',
    summary: 'Lucky Spot Barbershop\'s 15th annual community event in partnership with Cops & Barbers, featuring free haircuts at Charlotte-area Walmart locations.',
    url: 'https://www.eventbrite.com/e/lucky-spot-barbershop-15th-annual-back-to-school-weekend-charlotte-tickets-1583583393559',
    source: 'Eventbrite',
    date: '2025-08-24',
    tags: ['event', 'back-to-school', 'lucky-spot', 'free-haircuts']
  },
  {
    title: 'Carolina Barber Expo 2025',
    summary: 'Regional barber expo featuring barber battles, live demonstrations, and networking. Charlotte-area barbers and educators participating.',
    url: 'https://www.eventbrite.com/e/carolina-barber-expo-2025-tickets-1298600632449',
    source: 'Eventbrite',
    date: '2025-09-07',
    tags: ['event', 'expo', 'networking', 'education']
  }
];

CltEventsDesk.prototype.gather = function () {
  var self = this;
  var stories = self.SEED_STORIES.slice();

  var searchAdapter = require('../adapters/web-search');
  if (searchAdapter.isConfigured()) {
    var searches = self.queries.map(function (q) {
      return searchAdapter.search(q).then(function (results) {
        return results.map(function (r) {
          r.tags = r.tags || ['event', 'charlotte'];
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

module.exports = CltEventsDesk;
