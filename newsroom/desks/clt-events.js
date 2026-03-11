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

// Original stories written by RE UP Report staff — verified events
CltEventsDesk.prototype.SEED_STORIES = [
  {
    title: 'ACC Tournament fills Spectrum Center this week — barbers near uptown prepare for surge',
    summary: 'The ACC Men\'s Basketball Tournament runs March 10-14 at Spectrum Center in uptown Charlotte, bringing thousands of fans and alumni to the city. Barbershops within a few miles of uptown are extending hours and posting availability on social media to capture the influx.',
    url: '#acc-tournament-barber-surge-2026',
    source: 'RE UP Report',
    byline: 'RE UP Events Desk',
    date: '2026-03-09',
    tags: ['acc-tournament', 'spectrum-center', 'uptown', 'bookings', 'revenue'],
    type: 'original'
  },
  {
    title: 'Charlotte SHOUT! festival kicks off April 3 — uptown foot traffic expected to spike',
    summary: 'Charlotte SHOUT!, the city\'s major uptown arts and culture festival, runs April 3-19 with installations, live performances, and block parties. Barbershops near uptown and South End are gearing up for the foot traffic boost that comes with two-plus weeks of festival activity.',
    url: '#charlotte-shout-2026',
    source: 'RE UP Report',
    byline: 'RE UP Events Desk',
    date: '2026-03-07',
    tags: ['charlotte-shout', 'festival', 'uptown', 'foot-traffic', 'april'],
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
    title: 'Carolina Barber Expo returns to Myrtle Beach in September — Charlotte barbers plan the trip',
    summary: 'The Carolina Barber Expo is set for September 2026 at House of Blues in North Myrtle Beach, SC. After record attendance in 2025, organizers are expanding the vendor floor and adding education workshops. Charlotte barbers are already organizing group trips to compete in barber battles and network with brands.',
    url: '#carolina-barber-expo-2026',
    source: 'RE UP Report',
    byline: 'RE UP Events Desk',
    date: '2026-02-24',
    tags: ['event', 'expo', 'myrtle-beach', 'networking', 'education'],
    type: 'original'
  },
  {
    title: 'Charlotte FC and MLS All-Star Game to bring summer booking wave',
    summary: 'Charlotte FC\'s 2026 season is underway at Bank of America Stadium, and the city will host the MLS All-Star Game this summer — a first for Charlotte. Barbershops near uptown and South End are already seeing match-day booking patterns emerge, and the All-Star event is expected to draw national visitors.',
    url: '#mls-allstar-clt-2026',
    source: 'RE UP Report',
    byline: 'RE UP Events Desk',
    date: '2026-02-18',
    tags: ['charlotte-fc', 'mls', 'all-star-game', 'bookings', 'summer'],
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
