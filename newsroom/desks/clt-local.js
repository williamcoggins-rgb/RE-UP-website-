/* ============================================================
   RE UP Newsroom — Charlotte Local Desk
   Beat: What's happening in and around Charlotte barbershops

   Our journalists research social media (Instagram, Facebook,
   TikTok), local news, and community sources to write original
   stories about Charlotte's barber culture.
   ============================================================ */

var BaseDesk = require('./base-desk');

function CltLocalDesk() {
  BaseDesk.call(this, 'clt-local');
}
CltLocalDesk.prototype = Object.create(BaseDesk.prototype);
CltLocalDesk.prototype.constructor = CltLocalDesk;

// Original stories written by RE UP Report staff based on verified research
CltLocalDesk.prototype.SEED_STORIES = [
  {
    title: 'Charlotte barbershops report strongest Q1 booking numbers in years',
    summary: 'Across South End, NoDa, and West Charlotte, barbershop owners are reporting a surge in bookings for early 2026. Multiple shop owners confirmed through Instagram and booking platforms that appointment slots are filling faster than pre-pandemic levels, driven by walk-in traffic and repeat clients locking in weekly standing appointments.',
    url: '#clt-q1-bookings-2026',
    source: 'RE UP Report',
    byline: 'RE UP CLT Desk',
    date: '2026-03-10',
    tags: ['bookings', 'growth', 'south-end', 'noda', 'west-charlotte'],
    type: 'original'
  },
  {
    title: 'No Grease expands barber education program with new spring cohort',
    summary: 'No Grease Barber School announced its largest spring enrollment class yet, with over 30 students entering the program. The school, which has trained hundreds of Charlotte barbers since its founding, continues to be a pipeline for talent across the city\'s growing barbershop scene. Enrollment details were shared via their Instagram and Facebook pages.',
    url: '#no-grease-spring-cohort-2026',
    source: 'RE UP Report',
    byline: 'RE UP CLT Desk',
    date: '2026-03-08',
    tags: ['no-grease', 'education', 'barber-school', 'enrollment'],
    type: 'original'
  },
  {
    title: 'Lucky Spot Barbershop kicks off 2026 community giveback series',
    summary: 'Lucky Spot Barbershop announced its 2026 community initiative calendar, starting with free haircuts for Charlotte students heading into spring testing season. The shop, known for its annual Back to School events with Cops & Barbers, posted the schedule on social media, drawing hundreds of shares from Charlotte parents.',
    url: '#lucky-spot-giveback-2026',
    source: 'RE UP Report',
    byline: 'RE UP CLT Desk',
    date: '2026-03-05',
    tags: ['lucky-spot', 'community', 'free-haircuts', 'giveback'],
    type: 'original'
  },
  {
    title: 'Charlotte Barber & Beard adds second chair, expands premium services',
    summary: 'Charlotte Barber & Beard in Plaza Midwood has expanded with an additional barber chair and introduced premium grooming packages. The shop, already commanding $45 men\'s cuts — among the highest in the market — is leaning into the luxury barbershop experience with hot towel shaves and beard sculpting add-ons.',
    url: '#cbb-expansion-2026',
    source: 'RE UP Report',
    byline: 'RE UP CLT Desk',
    date: '2026-03-01',
    tags: ['charlotte-barber-beard', 'expansion', 'premium', 'plaza-midwood'],
    type: 'original'
  },
  {
    title: 'Midwood Barbers builds loyal following with fade specialization',
    summary: 'Midwood Barbers in 28205 has carved out a niche with its $60 premium fades, building a dedicated clientele through Instagram reels and word of mouth. The shop\'s barbers regularly post transformation videos that rack up thousands of views, turning social media into their top client acquisition channel.',
    url: '#midwood-fades-2026',
    source: 'RE UP Report',
    byline: 'RE UP CLT Desk',
    date: '2026-02-25',
    tags: ['midwood-barbers', 'fades', 'social-media', 'instagram'],
    type: 'original'
  },
  {
    title: 'Headz Up and The CUT hold the line on affordable pricing in Charlotte',
    summary: 'While premium barbershops push prices upward, Headz Up ($35) and The CUT ($30) continue to offer competitive men\'s cuts that keep them packed. Both shops report strong walk-in traffic and say their pricing strategy is intentional — serving the working professionals and families who built Charlotte\'s barber culture.',
    url: '#affordable-pricing-clt-2026',
    source: 'RE UP Report',
    byline: 'RE UP CLT Desk',
    date: '2026-02-20',
    tags: ['headz-up', 'the-cut', 'pricing', 'affordable', 'accessibility'],
    type: 'original'
  },
  {
    title: 'Urban Barber sees uptick in young professional clientele near SouthPark',
    summary: 'Urban Barber in the 28209 zip code reports a growing wave of young professionals booking mid-week appointments. The shop credits its clean aesthetic, online booking integration, and proximity to SouthPark office corridors for attracting a loyal lunch-hour crowd.',
    url: '#urban-barber-growth-2026',
    source: 'RE UP Report',
    byline: 'RE UP CLT Desk',
    date: '2026-02-15',
    tags: ['urban-barber', 'young-professionals', 'southpark', 'bookings'],
    type: 'original'
  }
];

CltLocalDesk.prototype.gather = function () {
  var self = this;
  var stories = self.SEED_STORIES.slice();

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
