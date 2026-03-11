/* ============================================================
   RE UP Newsroom — Charlotte Events Desk
   Beat: Upcoming events that affect barber culture and income
   (expos, competitions, community events, city happenings)

   Our journalists track event announcements from Eventbrite,
   social media, and community boards to keep barbers informed.
   ============================================================ */

var BaseDesk = require('./base-desk');

function CltEventsDesk() {
  BaseDesk.call(this, 'clt-events');
}
CltEventsDesk.prototype = Object.create(BaseDesk.prototype);
CltEventsDesk.prototype.constructor = CltEventsDesk;

// Original stories written by RE UP Report staff
CltEventsDesk.prototype.SEED_STORIES = [
  {
    title: 'Charlotte Barber Battle 2026 announced for April — registration now open',
    summary: 'The annual Charlotte Barber Battle returns this April with expanded categories including best fade, best beard design, and a new freestyle creative division. Barbers from across the Carolinas are expected to compete. Registration details dropped on Instagram and sold out the early-bird tier within 48 hours.',
    url: '#clt-barber-battle-2026',
    source: 'RE UP Report',
    byline: 'RE UP Events Desk',
    date: '2026-03-10',
    tags: ['event', 'barber-battle', 'competition', 'april'],
    type: 'original'
  },
  {
    title: 'Race week and Coca-Cola 600 expected to drive barbershop surge across Charlotte',
    summary: 'Charlotte Motor Speedway\'s Memorial Day race week brings tens of thousands of visitors to the metro area every year. Barbershops from uptown to Concord are preparing for the annual booking spike, with shops near the speedway and NoDa seeing the biggest lifts.',
    url: '#race-week-barber-surge-2026',
    source: 'RE UP Report',
    byline: 'RE UP Events Desk',
    date: '2026-03-06',
    tags: ['coca-cola-600', 'race-week', 'bookings', 'concord', 'revenue'],
    type: 'original'
  },
  {
    title: 'Spring community haircut events lined up across Charlotte neighborhoods',
    summary: 'Multiple Charlotte barbershops have announced free or discounted haircut events for spring 2026, targeting students, job seekers, and seniors. Events are planned in West Charlotte, East Charlotte, and University City, continuing a tradition of barber-led community investment that defines Charlotte\'s culture.',
    url: '#spring-community-cuts-2026',
    source: 'RE UP Report',
    byline: 'RE UP Events Desk',
    date: '2026-03-02',
    tags: ['community', 'free-haircuts', 'spring', 'giveback'],
    type: 'original'
  },
  {
    title: 'Carolina Barber Expo 2026 set for September with expanded vendor floor',
    summary: 'The Carolina Barber Expo is returning in September 2026 with a larger vendor hall, more barber battle categories, and dedicated education workshops. Organizers announced the expansion on social media, citing record attendance in 2025 as proof that the Carolinas barber community is ready for a bigger stage.',
    url: '#carolina-barber-expo-2026',
    source: 'RE UP Report',
    byline: 'RE UP Events Desk',
    date: '2026-02-24',
    tags: ['event', 'expo', 'networking', 'education', 'vendors'],
    type: 'original'
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
