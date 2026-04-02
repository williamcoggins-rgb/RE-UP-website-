# RE UP Newsroom Bugfix Implementation Plan

This patch note documents the highest-priority code changes needed in the newsroom pipeline.

## 1) Prevent first-run write failures

**Problem**
`newsroom/run.js` writes to `data/exports/newsroom.json` without ensuring the directory exists.

**Fix**
In `run.js`, before `fs.writeFileSync(config.NEWSROOM_FILE, ...)`, add:

```js
if (!fs.existsSync(config.DATA_DIR)) {
  fs.mkdirSync(config.DATA_DIR, { recursive: true });
}
```

## 2) Make desk search failures non-fatal

**Problem**
In each desk file, `Promise.all(searches)` causes one failed live search request to wipe out the full desk result set.

**Fix**
Replace the current `Promise.all(searches)` handling with either:

- `Promise.allSettled(searches)` and merge fulfilled result sets only, or
- wrap each search with `.catch(function () { return []; })`

Recommended pattern:

```js
var searches = self.queries.map(function (q) {
  return searchAdapter.search(q)
    .then(function (results) {
      return results.map(function (r) {
        r.tags = r.tags || ['charlotte', 'local'];
        return r;
      });
    })
    .catch(function () {
      return [];
    });
});
```

This preserves seed stories and partial live results.

## 3) Stop under-scoring RE UP original stories

**Problem**
Original stories use fragment URLs like `#clt-q1-bookings-2026`. In `utils.js`, trust scoring depends on extracting a real domain from the URL, so originals miss the trust bonus.

**Fix**
In `scoreArticle(article)` add an explicit trust override for RE UP originals:

```js
var isReupOriginal = article.type === 'original' || article.source === 'RE UP Report';
```

Then score trust like this:

```js
score += isReupOriginal
  ? config.SCORING.source_trust_weight
  : (isTrusted ? config.SCORING.source_trust_weight : config.SCORING.source_trust_weight * 0.4);
```

## 4) Do not assign today’s date when live search results have no extracted date

**Problem**
`newsroom/adapters/web-search.js` currently falls back to `new Date().toISOString().split('T')[0]` when Google results have no parsed date. That makes stale results look fresh.

**Fix**
Return `null` instead:

```js
date: extractDate(item.snippet) || null,
```

Then let `utils.js` handle unknown dates using the existing partial-credit path.

## 5) Tighten trusted-domain matching

**Problem**
`utils.js` currently treats a source as trusted when `domain.indexOf(d) !== -1`, which can incorrectly trust lookalike domains.

**Fix**
Replace with exact or subdomain-safe matching:

```js
var isTrusted = config.SCORING.trusted_sources.some(function (d) {
  return domain === d || domain.endsWith('.' + d);
});
```

## 6) Always emit a `type` field

**Problem**
`config.js` defines `type` as part of the article schema, but `formatArticle()` only sets it for originals.

**Fix**
Set `type` for all articles:

```js
type: raw.type || 'aggregated',
```

and then only add `byline` when `type === 'original'`.

## 7) Improve HTTP error handling in the web search adapter

**Problem**
`fetchJSON()` does not explicitly handle non-200 status codes or malformed error payloads.

**Fix**
Add status-code handling before parsing JSON:

```js
if (res.statusCode < 200 || res.statusCode >= 300) {
  reject(new Error('HTTP ' + res.statusCode + ' from ' + url));
  res.resume();
  return;
}
```

## Recommended file-by-file edits

- `newsroom/run.js`
  - ensure `config.DATA_DIR` exists before writing
- `newsroom/utils.js`
  - trust override for originals
  - safe trusted-domain matching
  - always set `type`
- `newsroom/adapters/web-search.js`
  - stop assigning today’s date to undated results
  - add non-200 HTTP handling
- `newsroom/desks/clt-local.js`
- `newsroom/desks/national-biz.js`
- `newsroom/desks/supply-chain.js`
- `newsroom/desks/clt-events.js`
  - make individual search failures return `[]` instead of failing the whole desk

## Suggested commit order

1. reliability: write path + adapter HTTP handling
2. scoring: original-story trust + trusted domain matching + type normalization
3. desk resilience: convert live searches to fault-tolerant behavior
4. optional: add a small smoke test script for the newsroom pipeline
