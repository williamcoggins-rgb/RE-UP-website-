/* ============================================================
   RE UP Newsroom — Supply Chain Desk
   Beat: Products, equipment, distributors, and brand news
   Sources: Modern Salon, Barber EVO, manufacturer press releases
   ============================================================ */

var BaseDesk = require('./base-desk');

function SupplyChainDesk() {
  BaseDesk.call(this, 'supply-chain');
}
SupplyChainDesk.prototype = Object.create(BaseDesk.prototype);
SupplyChainDesk.prototype.constructor = SupplyChainDesk;

// Supply chain news is harder to find in local media.
// Seed stories will grow as the web search adapter is enabled.
SupplyChainDesk.prototype.SEED_STORIES = [];

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
