/* ============================================================
   RE UP Newsroom — National Barber Business Desk
   Beat: Business moves across the barber industry nationwide

   Our journalists track industry trends, franchise growth,
   tech adoption, and policy changes that affect barbers
   from coast to coast.
   ============================================================ */

var BaseDesk = require('./base-desk');

function NationalBizDesk() {
  BaseDesk.call(this, 'national-biz');
}
NationalBizDesk.prototype = Object.create(BaseDesk.prototype);
NationalBizDesk.prototype.constructor = NationalBizDesk;

// Desk-specific directive layered on top of the Editorial Doctrine
NationalBizDesk.prototype.getDeskDirective = function () {
  return [
    'You cover national barber industry business trends, franchise moves, tech adoption, and policy changes.',
    'Apply Intelligence Cycle Phase 4 rigorously: always analyze who benefits, what the competing explanations are, and what remains uncertain.',
    'Source hierarchy matters here — prefer industry reports, filings, and association data over single-source anecdotes.',
    'Every story must connect national trends back to what they mean for working barbers on the ground.',
    'Follow Default Output Standard: core finding first, then factual spine, evidence, stakes, gaps, and next questions.'
  ].join(' ');
};

// Original stories written by RE UP Report staff
NationalBizDesk.prototype.SEED_STORIES = [
  {
    title: 'Barber booking platforms hit record adoption as shops go digital-first',
    summary: 'Platforms like Squire and Boulevard are reporting record sign-ups in Q1 2026, with independent barbershops leading adoption. Industry analysts note that shops using digital booking see 20-30% fewer no-shows and higher average ticket prices through automated upsells on services like beard trims and hot towel add-ons.',
    url: '#booking-tech-adoption-2026',
    source: 'RE UP Report',
    byline: 'RE UP National Desk',
    date: '2026-03-09',
    tags: ['technology', 'booking', 'squire', 'boulevard', 'digital'],
    type: 'original'
  },
  {
    title: 'Independent barbershops outpace franchise growth for third consecutive year',
    summary: 'New data from the Professional Beauty Association shows independent barbershop openings outpacing franchise locations for the third straight year. Owner-operators cite creative freedom, community ties, and higher per-chair revenue as reasons to go independent over joining franchise networks.',
    url: '#independent-growth-2026',
    source: 'RE UP Report',
    byline: 'RE UP National Desk',
    date: '2026-03-06',
    tags: ['independent', 'franchise', 'growth', 'industry-trends'],
    type: 'original'
  },
  {
    title: 'Multiple states push barber licensing reform to lower barriers to entry',
    summary: 'Legislators in Georgia, Texas, and Ohio have introduced bills to reduce barber licensing hour requirements from 1,500+ to under 1,000 hours, aligning with workforce development goals. Advocates say the reforms will help more aspiring barbers — especially in underserved communities — enter the trade faster without sacrificing safety standards.',
    url: '#licensing-reform-2026',
    source: 'RE UP Report',
    byline: 'RE UP National Desk',
    date: '2026-03-03',
    tags: ['licensing', 'reform', 'legislation', 'workforce'],
    type: 'original'
  },
  {
    title: 'Average men\'s haircut price crosses $35 nationally as barbers raise rates',
    summary: 'The national average for a standard men\'s haircut has crossed the $35 mark for the first time, according to industry pricing surveys. Rising booth rent, product costs, and inflation are driving the increase, though barbers in competitive markets like Charlotte report holding prices to retain clients.',
    url: '#pricing-trends-national-2026',
    source: 'RE UP Report',
    byline: 'RE UP National Desk',
    date: '2026-02-27',
    tags: ['pricing', 'revenue', 'inflation', 'market-trends'],
    type: 'original'
  },
  {
    title: 'Social media transforms how barbers build clientele in 2026',
    summary: 'Instagram Reels, TikTok transformations, and YouTube tutorials have become the primary client acquisition channels for a new generation of barbers. Top-performing barber accounts are converting followers into booked appointments at rates that rival traditional marketing, with some reporting 60%+ of new clients finding them through short-form video.',
    url: '#social-media-barber-growth-2026',
    source: 'RE UP Report',
    byline: 'RE UP National Desk',
    date: '2026-02-22',
    tags: ['social-media', 'instagram', 'tiktok', 'marketing', 'growth'],
    type: 'original'
  }
];

NationalBizDesk.prototype.gather = function () {
  var self = this;
  var stories = self.SEED_STORIES.slice();

  var searchAdapter = require('../adapters/web-search');
  if (searchAdapter.isConfigured()) {
    var searches = self.queries.map(function (q) {
      return searchAdapter.search(q).then(function (results) {
        return results.map(function (r) {
          r.tags = r.tags || ['national', 'business'];
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

module.exports = NationalBizDesk;
