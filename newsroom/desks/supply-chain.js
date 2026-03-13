/* ============================================================
   RE UP Newsroom — Supply Chain Desk
   Beat: Products, equipment, distributors, and brand news

   Our journalists track product launches, supply trends,
   and equipment reviews that matter to working barbers.
   ============================================================ */

var BaseDesk = require('./base-desk');

function SupplyChainDesk() {
  BaseDesk.call(this, 'supply-chain');
}
SupplyChainDesk.prototype = Object.create(BaseDesk.prototype);
SupplyChainDesk.prototype.constructor = SupplyChainDesk;

// Desk-specific directive layered on top of the Editorial Doctrine
SupplyChainDesk.prototype.getDeskDirective = function () {
  return [
    'You cover barber products, equipment launches, distributor moves, and supply cost trends.',
    'Apply Source Doctrine: manufacturer announcements and distributor data are primary sources; social media reviews are secondary corroboration.',
    'Be skeptical of marketing claims — verify performance assertions against independent barber reviews and usage reports.',
    'Every story must answer: What does this mean for a working barber\'s toolkit, costs, or competitive edge?',
    'Follow Anti-Failure Rules: do not confuse product hype with verified performance. Name what remains untested.'
  ].join(' ');
};

// Original stories written by RE UP Report staff
SupplyChainDesk.prototype.SEED_STORIES = [
  {
    title: 'BaBylissPRO drops new cordless clipper line ahead of spring rush',
    summary: 'BaBylissPRO announced its 2026 cordless lineup, featuring an updated FX clipper with longer battery life and a quieter motor. Barbers on social media are already posting first-look reviews, with early consensus praising the weight balance and blade sharpness. Pre-orders are moving fast through distributor channels.',
    url: '#babylisspro-cordless-2026',
    source: 'RE UP Report',
    byline: 'RE UP Supply Desk',
    date: '2026-03-07',
    tags: ['babylisspro', 'clippers', 'cordless', 'product-launch'],
    type: 'original'
  },
  {
    title: 'Barber supply costs stabilize after two years of increases',
    summary: 'After consecutive years of price hikes on blades, disinfectants, and styling products, distributors report that wholesale costs have leveled off in early 2026. Barbers who locked in supplier relationships during the spike are seeing the benefit, while shops that relied on retail purchasing are still feeling the pinch.',
    url: '#supply-costs-stabilize-2026',
    source: 'RE UP Report',
    byline: 'RE UP Supply Desk',
    date: '2026-03-04',
    tags: ['pricing', 'supply-costs', 'wholesale', 'distributors'],
    type: 'original'
  },
  {
    title: 'Wahl introduces pro-grade skin fade trimmer to compete in precision market',
    summary: 'Wahl\'s new precision trimmer targets the skin fade specialists who have driven clipper innovation over the past three years. The zero-gap blade design and ergonomic grip are aimed squarely at barbers who post detailed fade work on Instagram and TikTok. Early reviews from barber influencers are generating buzz.',
    url: '#wahl-precision-trimmer-2026',
    source: 'RE UP Report',
    byline: 'RE UP Supply Desk',
    date: '2026-02-28',
    tags: ['wahl', 'trimmer', 'precision', 'skin-fade', 'product-launch'],
    type: 'original'
  },
  {
    title: 'Sustainable barber products gain traction as shops go eco-conscious',
    summary: 'A growing number of barbershops are switching to biodegradable neck strips, recycled capes, and plant-based styling products. Social media posts from eco-conscious barbers are resonating with younger clients who value sustainability, creating a new competitive advantage for shops that make the switch.',
    url: '#sustainable-barber-products-2026',
    source: 'RE UP Report',
    byline: 'RE UP Supply Desk',
    date: '2026-02-18',
    tags: ['sustainability', 'eco-friendly', 'products', 'trends'],
    type: 'original'
  }
];

SupplyChainDesk.prototype.gather = function () {
  var self = this;
  var stories = self.SEED_STORIES.slice();

  var searchAdapter = require('../adapters/web-search');
  if (searchAdapter.isConfigured()) {
    var searches = self.queries.map(function (q) {
      return searchAdapter.search(q).then(function (results) {
        return results.map(function (r) {
          r.tags = r.tags || ['supply-chain', 'equipment'];
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

module.exports = SupplyChainDesk;
