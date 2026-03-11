/* ============================================================
   RE UP Newsroom — National Barber Business Desk
   Beat: Business moves across the barber industry nationwide
   Sources: Reuters, BizJournals, Barber EVO, Modern Salon, AP
   ============================================================ */

var BaseDesk = require('./base-desk');

function NationalBizDesk() {
  BaseDesk.call(this, 'national-biz');
}
NationalBizDesk.prototype = Object.create(BaseDesk.prototype);
NationalBizDesk.prototype.constructor = NationalBizDesk;

NationalBizDesk.prototype.SEED_STORIES = [
  {
    title: 'Beloved Black-owned barbershop No Grease turns 25',
    summary: 'Profile of No Grease on its 25th anniversary, covering its growth from one shop in 1997 to 13 locations, a barber school, and a $2.5M crowdfunding campaign for expansion.',
    url: 'https://www.axios.com/local/charlotte/2022/06/17/beloved-black-owned-barbershop-no-grease-turns-25-300689',
    source: 'Axios Charlotte',
    date: '2022-06-17',
    tags: ['no-grease', 'franchise', 'growth', 'crowdfunding']
  },
  {
    title: 'SouthPark shift: After calls to protest, the mall will keep No Grease',
    summary: 'Community pressure reversed SouthPark Mall\'s decision to terminate No Grease\'s lease early — a case study in how Black-owned barbershops navigate commercial real estate.',
    url: 'https://www.axios.com/local/charlotte/2021/03/03/southpark-mall-terminates-no-greases-lease-9-months-early-249814',
    source: 'Axios Charlotte',
    date: '2021-03-03',
    tags: ['no-grease', 'real-estate', 'lease', 'black-owned']
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
