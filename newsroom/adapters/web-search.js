/* ============================================================
   RE UP Newsroom — Web Search Adapter

   Pluggable adapter for live news fetching.
   Currently supports:
     - Google Custom Search (GOOGLE_CSE_KEY + GOOGLE_CSE_CX)
     - NewsAPI (NEWSAPI_KEY)
     - None (returns empty, desks fall back to seed stories)

   To enable live search:
     1. Set env vars for your preferred provider
     2. Restart the newsroom pipeline

   The adapter normalizes all results into the standard article shape:
   { title, summary, url, source, date, tags }
   ============================================================ */

var https = require('https');

// --- Provider detection ---
function getProvider() {
  if (process.env.GOOGLE_CSE_KEY && process.env.GOOGLE_CSE_CX) {
    return 'google';
  }
  if (process.env.NEWSAPI_KEY) {
    return 'newsapi';
  }
  return null;
}

function isConfigured() {
  return getProvider() !== null;
}

// --- HTTP helper ---
function fetchJSON(url) {
  return new Promise(function (resolve, reject) {
    https.get(url, function (res) {
      var data = '';
      res.on('data', function (chunk) { data += chunk; });
      res.on('end', function () {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Invalid JSON from ' + url));
        }
      });
    }).on('error', reject);
  });
}

// --- Google Custom Search ---
function searchGoogle(query) {
  var key = process.env.GOOGLE_CSE_KEY;
  var cx = process.env.GOOGLE_CSE_CX;
  var url = 'https://www.googleapis.com/customsearch/v1?key=' +
    encodeURIComponent(key) + '&cx=' + encodeURIComponent(cx) +
    '&q=' + encodeURIComponent(query) + '&num=5&dateRestrict=m3';

  return fetchJSON(url).then(function (data) {
    if (!data.items) return [];
    return data.items.map(function (item) {
      return {
        title: item.title || '',
        summary: item.snippet || '',
        url: item.link || '',
        source: extractSource(item.displayLink || item.link || ''),
        date: extractDate(item.snippet) || new Date().toISOString().split('T')[0],
        tags: []
      };
    });
  });
}

// --- NewsAPI ---
function searchNewsAPI(query) {
  var key = process.env.NEWSAPI_KEY;
  var url = 'https://newsapi.org/v2/everything?apiKey=' +
    encodeURIComponent(key) + '&q=' + encodeURIComponent(query) +
    '&sortBy=publishedAt&pageSize=5&language=en';

  return fetchJSON(url).then(function (data) {
    if (!data.articles) return [];
    return data.articles.map(function (a) {
      return {
        title: a.title || '',
        summary: a.description || '',
        url: a.url || '',
        source: (a.source && a.source.name) || '',
        date: a.publishedAt ? a.publishedAt.split('T')[0] : new Date().toISOString().split('T')[0],
        tags: []
      };
    });
  });
}

// --- Main search function ---
function search(query) {
  var provider = getProvider();
  if (provider === 'google') return searchGoogle(query);
  if (provider === 'newsapi') return searchNewsAPI(query);
  return Promise.resolve([]);
}

// --- Helpers ---
function extractSource(link) {
  try {
    return new URL(link.indexOf('http') === 0 ? link : 'https://' + link)
      .hostname.replace('www.', '');
  } catch (e) {
    return link;
  }
}

function extractDate(text) {
  if (!text) return null;
  var match = text.match(/(\d{4}-\d{2}-\d{2})/);
  if (match) return match[1];
  // Try "Mon DD, YYYY" format
  var match2 = text.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}/i);
  if (match2) {
    var d = new Date(match2[0]);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  }
  return null;
}

module.exports = {
  isConfigured: isConfigured,
  search: search,
  getProvider: getProvider
};
