// ──────────────────────────────────────────────────────────────
// RE UP — Google Places Client Helper
// All calls go through /api/places/* proxy (never exposes API key)
// ──────────────────────────────────────────────────────────────

(function () {
  'use strict';

  // Charlotte zip code centroids for geo-lookup
  var ZIP_COORDS = {
    '28202': { lat: 35.2271, lng: -80.8431 },  // Uptown
    '28203': { lat: 35.2118, lng: -80.8587 },  // South End / Dilworth
    '28204': { lat: 35.2177, lng: -80.8247 },  // Plaza Midwood / Elizabeth
    '28205': { lat: 35.2283, lng: -80.7971 },  // NoDa / Shamrock
    '28206': { lat: 35.2620, lng: -80.8107 },  // North Charlotte / Druid Hills
    '28207': { lat: 35.2050, lng: -80.8190 },  // Myers Park / Eastover
    '28208': { lat: 35.2230, lng: -80.9080 },  // West Charlotte / Airport
    '28209': { lat: 35.1810, lng: -80.8530 },  // South Charlotte / Montford
    '28210': { lat: 35.1510, lng: -80.8770 },  // South Charlotte / Quail Hollow
    '28211': { lat: 35.1800, lng: -80.8080 },  // SouthPark
    '28212': { lat: 35.1780, lng: -80.7450 },  // East Charlotte / Idlewild
    '28213': { lat: 35.2870, lng: -80.7470 },  // University / Hidden Valley
    '28214': { lat: 35.2600, lng: -80.9540 },  // West Charlotte / Moores Chapel
    '28215': { lat: 35.2490, lng: -80.7280 },  // Eastway / Albemarle
    '28216': { lat: 35.3100, lng: -80.8870 },  // Northlake / Derita
    '28217': { lat: 35.1700, lng: -80.9180 },  // Steele Creek
    '28226': { lat: 35.1180, lng: -80.8100 },  // Ballantyne
    '28227': { lat: 35.1610, lng: -80.6960 },  // Mint Hill
    '28244': { lat: 35.2271, lng: -80.8431 },  // Uptown (PO)
    '28262': { lat: 35.3370, lng: -80.7440 },  // University City
    '28269': { lat: 35.3420, lng: -80.8380 },  // Highland Creek / Newell
    '28270': { lat: 35.1130, lng: -80.7620 },  // Providence / Weddington
    '28273': { lat: 35.1210, lng: -80.9510 },  // Steele Creek / Lake Wylie
    '28277': { lat: 35.0590, lng: -80.8470 },  // Ballantyne / Ardrey Kell
    '28278': { lat: 35.1010, lng: -80.9710 }   // Lake Wylie / Berewick
  };

  // Simple fetch wrapper with error handling
  function apiGet(path) {
    return fetch(path).then(function (resp) {
      if (!resp.ok) {
        return resp.json().then(function (err) {
          throw new Error(err.error || 'API request failed (' + resp.status + ')');
        });
      }
      return resp.json();
    });
  }

  // ── Public API ─────────────────────────────────────────────

  /**
   * Search for barbershops near a lat/lng
   * @param {number} lat
   * @param {number} lng
   * @param {number} [radius=5000] meters
   * @returns {Promise<{status: string, results: Array, next_page_token: string|null}>}
   */
  function searchNearbyBarbers(lat, lng, radius) {
    var r = radius || 5000;
    return apiGet('/api/places/nearby?lat=' + lat + '&lng=' + lng + '&radius=' + r);
  }

  /**
   * Search by zip code — converts zip to coords, then runs nearby search
   * @param {string} zipCode 5-digit Charlotte zip
   * @param {number} [radius=5000]
   * @returns {Promise}
   */
  function searchBarbersByZip(zipCode, radius) {
    var coords = ZIP_COORDS[zipCode];
    if (!coords) {
      return Promise.reject(new Error('Unknown Charlotte zip code: ' + zipCode));
    }
    return searchNearbyBarbers(coords.lat, coords.lng, radius || 8000);
  }

  /**
   * Free-text search (e.g. "best barbershop University area")
   * @param {string} query
   * @returns {Promise}
   */
  function textSearch(query) {
    return apiGet('/api/places/textsearch?q=' + encodeURIComponent(query));
  }

  /**
   * Get full details for a specific place
   * @param {string} placeId Google place_id
   * @returns {Promise<{status: string, result: object}>}
   */
  function getPlaceDetails(placeId) {
    return apiGet('/api/places/details/' + encodeURIComponent(placeId));
  }

  /**
   * Get reviews for a place (convenience wrapper — reviews come with details)
   * @param {string} placeId
   * @returns {Promise<Array>}
   */
  function getPlaceReviews(placeId) {
    return getPlaceDetails(placeId).then(function (data) {
      return data.result ? data.result.reviews || [] : [];
    });
  }

  /**
   * Autocomplete search input
   * @param {string} input partial text
   * @returns {Promise<{predictions: Array}>}
   */
  function autocomplete(input) {
    return apiGet('/api/places/autocomplete?input=' + encodeURIComponent(input));
  }

  /**
   * Build a proxied photo URL (safe to use in img src)
   * @param {string} photoReference
   * @param {number} [maxWidth=400]
   * @returns {string}
   */
  function photoUrl(photoReference, maxWidth) {
    return '/api/places/photo?ref=' + encodeURIComponent(photoReference) +
           '&maxwidth=' + (maxWidth || 400);
  }

  /**
   * Get coords for a Charlotte zip code
   * @param {string} zip
   * @returns {{lat: number, lng: number}|null}
   */
  function getZipCoords(zip) {
    return ZIP_COORDS[zip] || null;
  }

  /**
   * List all known zip codes
   * @returns {string[]}
   */
  function getKnownZips() {
    return Object.keys(ZIP_COORDS);
  }

  // ── Expose on window ───────────────────────────────────────
  window.RE_UP_PLACES = {
    searchNearbyBarbers: searchNearbyBarbers,
    searchBarbersByZip: searchBarbersByZip,
    textSearch: textSearch,
    getPlaceDetails: getPlaceDetails,
    getPlaceReviews: getPlaceReviews,
    autocomplete: autocomplete,
    photoUrl: photoUrl,
    getZipCoords: getZipCoords,
    getKnownZips: getKnownZips,
    ZIP_COORDS: ZIP_COORDS
  };
})();
