/* ============================================================
   RE UP Report — Dashboard Map + Live Data Integration
   js/dashboard-map.js

   Handles:
   1. Google Maps interactive map with shop pins
   2. "Refresh Live Data" button — pulls from /api/places/*
   3. Shop detail sidebar (hours, reviews, photos)
   ============================================================ */

(function () {
  'use strict';

  // ── State ────────────────────────────────────────────────────
  var map = null;
  var markers = [];
  var infoWindow = null;
  var activeTierFilter = 'all';
  var liveShops = [];       // Shops fetched from Google Places
  var isMapReady = false;

  // Charlotte center
  var CLT_CENTER = { lat: 35.2271, lng: -80.8431 };

  // Tier colors for map pins
  var TIER_COLORS = {
    'Premium':  '#e50914',
    'Mid-tier': '#f59e0b',
    'Value':    '#22c55e',
    'live':     '#3b82f6'
  };

  // ── Map Initialization ──────────────────────────────────────

  function initMap() {
    var canvas = document.getElementById('map-canvas');
    if (!canvas) return;

    // Check if Google Maps is loaded
    if (typeof google === 'undefined' || !google.maps) {
      // Show fallback — map loads async, may not be available
      canvas.innerHTML =
        '<div class="map-fallback">' +
          '<p class="map-fallback-title">Interactive Map</p>' +
          '<p class="map-fallback-desc">Configure your Google Maps API key to enable the interactive map.<br>' +
          'Shops are plotted from your competitor data + live Google Places lookups.</p>' +
          '<p class="map-fallback-hint">Add your key to wrangler.toml &rarr; GOOGLE_PLACES_API_KEY</p>' +
        '</div>';
      return;
    }

    map = new google.maps.Map(canvas, {
      center: CLT_CENTER,
      zoom: 11,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      styles: getMapStyles()
    });

    infoWindow = new google.maps.InfoWindow();
    isMapReady = true;

    // Plot static competitor data
    plotStaticShops();

    // Set up filter buttons
    setupMapFilters();

    // Set up sidebar close
    var closeBtn = document.getElementById('map-sidebar-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        var sidebar = document.getElementById('map-sidebar');
        if (sidebar) sidebar.classList.remove('map-sidebar--open');
      });
    }
  }

  // ── Plot Static Shops ───────────────────────────────────────

  function plotStaticShops() {
    if (!map || !window.RE_UP_MARKET) return;

    var competitors = window.RE_UP_MARKET.COMPETITORS || [];
    var places = window.RE_UP_PLACES;

    competitors.forEach(function (shop) {
      var coords = places ? places.getZipCoords(shop.zip) : null;
      if (!coords) return;

      // Jitter slightly so pins in same zip don't stack perfectly
      var lat = coords.lat + (Math.random() - 0.5) * 0.008;
      var lng = coords.lng + (Math.random() - 0.5) * 0.008;

      addMarker({
        lat: lat,
        lng: lng,
        name: shop.name,
        tier: shop.tier || 'Mid-tier',
        rating: shop.rating,
        avgCut: shop.avgCut,
        model: shop.model,
        zip: shop.zip,
        neighborhood: shop.neighborhood,
        source: 'static',
        placeId: null
      });
    });
  }

  // ── Plot Live Shops ─────────────────────────────────────────

  function plotLiveShops(shops) {
    shops.forEach(function (shop) {
      // Check for duplicates by name (fuzzy)
      var isDuplicate = markers.some(function (m) {
        return m._shopData && m._shopData.name &&
          m._shopData.name.toLowerCase() === shop.name.toLowerCase();
      });
      if (isDuplicate) return;

      addMarker({
        lat: shop.lat,
        lng: shop.lng,
        name: shop.name,
        tier: 'live',
        rating: shop.rating,
        avgCut: null,
        model: null,
        zip: null,
        neighborhood: shop.address,
        source: 'google',
        placeId: shop.place_id
      });
    });
  }

  // ── Marker Management ───────────────────────────────────────

  function addMarker(data) {
    if (!map) return;

    var color = TIER_COLORS[data.tier] || TIER_COLORS['Mid-tier'];

    var marker = new google.maps.Marker({
      position: { lat: data.lat, lng: data.lng },
      map: map,
      title: data.name,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: color,
        fillOpacity: 0.9,
        strokeColor: '#ffffff',
        strokeWeight: 1.5,
        scale: 8
      }
    });

    marker._shopData = data;
    marker._tier = data.tier;

    marker.addListener('click', function () {
      showShopInfo(marker);
    });

    markers.push(marker);
    return marker;
  }

  function showShopInfo(marker) {
    var data = marker._shopData;

    // Brief info window on map
    var ratingStr = data.rating && data.rating !== '---' ? data.rating + ' stars' : 'No rating';
    var priceStr = data.avgCut && data.avgCut !== '---' ? '$' + data.avgCut : '';

    infoWindow.setContent(
      '<div style="color:#111;font-family:sans-serif;padding:4px;">' +
        '<strong>' + escapeHtml(data.name) + '</strong><br>' +
        '<span style="font-size:12px;color:#666;">' + escapeHtml(ratingStr) +
        (priceStr ? ' &middot; ' + escapeHtml(priceStr) : '') + '</span>' +
      '</div>'
    );
    infoWindow.open(map, marker);

    // Open sidebar with details
    openSidebar(data);
  }

  // ── Sidebar ─────────────────────────────────────────────────

  function openSidebar(data) {
    var sidebar = document.getElementById('map-sidebar');
    var content = document.getElementById('map-sidebar-content');
    if (!sidebar || !content) return;

    sidebar.classList.add('map-sidebar--open');

    var sourceTag = data.source === 'google'
      ? '<span class="map-source-tag map-source-tag--live">Live Google Data</span>'
      : '<span class="map-source-tag map-source-tag--static">RE UP Database</span>';

    var ratingHtml = '';
    if (data.rating && data.rating !== '---') {
      ratingHtml = '<div class="map-detail-rating">' + escapeHtml(String(data.rating)) + ' <span class="map-stars">&#9733;</span></div>';
    }

    var detailsHtml =
      '<div class="map-shop-header">' +
        '<h4 class="map-shop-name">' + escapeHtml(data.name) + '</h4>' +
        sourceTag +
      '</div>' +
      ratingHtml +
      '<div class="map-detail-meta">';

    if (data.neighborhood) {
      detailsHtml += '<div class="map-detail-row"><span class="map-detail-label">Location</span><span>' + escapeHtml(data.neighborhood) + '</span></div>';
    }
    if (data.zip) {
      detailsHtml += '<div class="map-detail-row"><span class="map-detail-label">Zip</span><span>' + escapeHtml(data.zip) + '</span></div>';
    }
    if (data.avgCut && data.avgCut !== '---') {
      detailsHtml += '<div class="map-detail-row"><span class="map-detail-label">Avg Cut</span><span>$' + escapeHtml(String(data.avgCut)) + '</span></div>';
    }
    if (data.model) {
      detailsHtml += '<div class="map-detail-row"><span class="map-detail-label">Model</span><span>' + escapeHtml(data.model) + '</span></div>';
    }
    detailsHtml += '</div>';

    // If this is a Google place, offer to load full details
    if (data.placeId && window.RE_UP_PLACES) {
      detailsHtml += '<div id="map-place-details" class="map-place-details">' +
        '<button class="btn btn-sm btn-outline" id="load-place-details">Load Hours, Reviews & Photos</button>' +
      '</div>';
    }

    content.innerHTML = detailsHtml;

    // Wire up the load details button
    var loadBtn = document.getElementById('load-place-details');
    if (loadBtn && data.placeId) {
      loadBtn.addEventListener('click', function () {
        loadBtn.disabled = true;
        loadBtn.textContent = 'Loading...';
        loadPlaceDetails(data.placeId);
      });
    }
  }

  function loadPlaceDetails(placeId) {
    var container = document.getElementById('map-place-details');
    if (!container || !window.RE_UP_PLACES) return;

    window.RE_UP_PLACES.getPlaceDetails(placeId).then(function (data) {
      if (!data.result) {
        container.innerHTML = '<p class="map-detail-error">Could not load details.</p>';
        return;
      }

      var r = data.result;
      var html = '';

      // Hours
      if (r.hours && r.hours.weekday_text && r.hours.weekday_text.length) {
        html += '<div class="map-detail-section">' +
          '<h5 class="map-detail-section-title">Hours</h5>' +
          '<div class="map-hours-list">';
        r.hours.weekday_text.forEach(function (line) {
          html += '<div class="map-hours-row">' + escapeHtml(line) + '</div>';
        });
        html += '</div>';
        if (r.hours.open_now !== null) {
          html += '<span class="map-open-badge map-open-badge--' + (r.hours.open_now ? 'open' : 'closed') + '">' +
            (r.hours.open_now ? 'Open Now' : 'Closed') + '</span>';
        }
        html += '</div>';
      }

      // Reviews
      if (r.reviews && r.reviews.length) {
        html += '<div class="map-detail-section">' +
          '<h5 class="map-detail-section-title">Recent Reviews</h5>';
        r.reviews.forEach(function (rev) {
          html += '<div class="map-review">' +
            '<div class="map-review-header">' +
              '<strong>' + escapeHtml(rev.author) + '</strong>' +
              '<span class="map-review-rating">' + escapeHtml(String(rev.rating)) + ' &#9733;</span>' +
            '</div>' +
            '<p class="map-review-text">' + escapeHtml(rev.text.substring(0, 200)) + (rev.text.length > 200 ? '...' : '') + '</p>' +
            '<span class="map-review-time">' + escapeHtml(rev.time) + '</span>' +
          '</div>';
        });
        html += '</div>';
      }

      // Photos
      if (r.photos && r.photos.length) {
        html += '<div class="map-detail-section">' +
          '<h5 class="map-detail-section-title">Photos</h5>' +
          '<div class="map-photos-grid">';
        r.photos.forEach(function (photo) {
          var imgUrl = window.RE_UP_PLACES.photoUrl(photo.reference, 300);
          html += '<img class="map-photo" src="' + imgUrl + '" alt="Shop photo" loading="lazy">';
        });
        html += '</div></div>';
      }

      // Links
      if (r.website || r.maps_url) {
        html += '<div class="map-detail-section map-detail-links">';
        if (r.website) {
          html += '<a href="' + escapeHtml(r.website) + '" target="_blank" rel="noopener" class="map-link">Visit Website</a>';
        }
        if (r.maps_url) {
          html += '<a href="' + escapeHtml(r.maps_url) + '" target="_blank" rel="noopener" class="map-link">Open in Google Maps</a>';
        }
        html += '</div>';
      }

      container.innerHTML = html;
    }).catch(function (err) {
      container.innerHTML = '<p class="map-detail-error">Error: ' + escapeHtml(err.message) + '</p>';
    });
  }

  // ── Map Filters ─────────────────────────────────────────────

  function setupMapFilters() {
    var buttons = document.querySelectorAll('.map-filter-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        activeTierFilter = btn.getAttribute('data-tier');
        applyMarkerFilter();
      });
    });
  }

  function applyMarkerFilter() {
    markers.forEach(function (marker) {
      if (activeTierFilter === 'all') {
        marker.setVisible(true);
      } else {
        marker.setVisible(marker._tier === activeTierFilter);
      }
    });
  }

  // ── Refresh Live Data ───────────────────────────────────────

  function setupRefreshButton() {
    var btn = document.getElementById('refresh-live-data');
    var status = document.getElementById('live-status');
    var icon = document.getElementById('refresh-icon');
    if (!btn) return;

    btn.addEventListener('click', function () {
      if (!window.RE_UP_PLACES) {
        if (status) status.textContent = 'Google Places not configured';
        return;
      }

      btn.disabled = true;
      if (icon) icon.classList.add('spinning');
      if (status) {
        status.textContent = 'Fetching live data...';
        status.className = 'live-status live-status--loading';
      }

      // Search across key Charlotte zips
      var targetZips = ['28202', '28203', '28205', '28206', '28208', '28209',
                        '28211', '28213', '28215', '28216', '28262', '28269', '28273'];

      var searches = targetZips.map(function (zip) {
        return window.RE_UP_PLACES.searchBarbersByZip(zip).catch(function () {
          return { results: [] };
        });
      });

      Promise.all(searches).then(function (results) {
        var allShops = [];
        var seen = {};

        results.forEach(function (res) {
          (res.results || []).forEach(function (shop) {
            if (!seen[shop.place_id]) {
              seen[shop.place_id] = true;
              allShops.push(shop);
            }
          });
        });

        liveShops = allShops;

        // Merge into competitor table
        mergeWithCompetitorTable(allShops);

        // Plot on map
        if (isMapReady) {
          plotLiveShops(allShops);
        }

        btn.disabled = false;
        if (icon) icon.classList.remove('spinning');
        if (status) {
          status.textContent = allShops.length + ' shops found via Google Places';
          status.className = 'live-status live-status--success';
        }
      }).catch(function (err) {
        btn.disabled = false;
        if (icon) icon.classList.remove('spinning');
        if (status) {
          status.textContent = 'Error: ' + err.message;
          status.className = 'live-status live-status--error';
        }
      });
    });
  }

  // ── Merge Live Data with Competitor Table ───────────────────

  function mergeWithCompetitorTable(liveResults) {
    var tbody = document.getElementById('competitor-tbody');
    if (!tbody) return;

    // Get existing names for dedup
    var existingNames = {};
    var competitors = (window.RE_UP_MARKET && window.RE_UP_MARKET.COMPETITORS) || [];
    competitors.forEach(function (c) {
      existingNames[c.name.toLowerCase()] = true;
    });

    var newRows = [];
    liveResults.forEach(function (shop) {
      if (existingNames[shop.name.toLowerCase()]) return;
      existingNames[shop.name.toLowerCase()] = true;

      newRows.push({
        name: shop.name,
        neighborhood: shop.address || '',
        zip: '',
        avgCut: '---',
        rating: shop.rating || '---',
        barbers: '---',
        model: '---',
        isLive: true
      });
    });

    // Append new rows
    newRows.forEach(function (c) {
      var tr = document.createElement('tr');
      tr.className = 'live-data-row';
      var ratingStr = (c.rating && c.rating !== '---') ? Number(c.rating).toFixed(1) : '---';
      tr.innerHTML =
        '<td data-label="Shop Name">' + escapeHtml(c.name) + ' <span class="live-badge">LIVE</span></td>' +
        '<td data-label="Neighborhood">' + escapeHtml(c.neighborhood) + '</td>' +
        '<td class="cell-mono" data-label="Zip">' + escapeHtml(c.zip) + '</td>' +
        '<td class="cell-price" data-label="Avg Cut">' + escapeHtml(c.avgCut) + '</td>' +
        '<td data-label="Rating">' + escapeHtml(ratingStr) + '</td>' +
        '<td data-label="Barbers">' + escapeHtml(c.barbers) + '</td>' +
        '<td data-label="Model">' + escapeHtml(c.model) + '</td>';
      tbody.appendChild(tr);
    });
  }

  // ── Dark Map Styles ─────────────────────────────────────────

  function getMapStyles() {
    return [
      { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a2e' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2a2a3e' }] },
      { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1a1a2e' }] },
      { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3a3a4e' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1525' }] },
      { featureType: 'poi', stylers: [{ visibility: 'off' }] },
      { featureType: 'transit', stylers: [{ visibility: 'off' }] },
      { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#2a2a3e' }] }
    ];
  }

  // ── Google Maps Loader ──────────────────────────────────────

  function loadGoogleMapsAPI() {
    // Check if already loaded
    if (typeof google !== 'undefined' && google.maps) {
      initMap();
      return;
    }

    // Global callback must exist before the script tag runs
    window.__reupMapInit = function () {
      initMap();
    };

    // Fetch the key from the server, then inject the Maps script with it
    fetch('/api/maps-key')
      .then(function (resp) { return resp.json(); })
      .then(function (data) {
        var key = data.key || '';
        var script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js' +
          '?key=' + encodeURIComponent(key) +
          '&callback=__reupMapInit' +
          '&libraries=places';
        script.async = true;
        script.defer = true;
        script.onerror = function () {
          // Key invalid or network failure — show static fallback
          initMap();
        };
        document.head.appendChild(script);
      })
      .catch(function () {
        // Endpoint unavailable — show fallback without crashing
        initMap();
      });
  }

  // ── Expose for dashboard.js init ────────────────────────────
  window.RE_UP_MAP = {
    init: function () {
      loadGoogleMapsAPI();
      setupRefreshButton();
    },
    getMap: function () { return map; },
    getLiveShops: function () { return liveShops; }
  };

})();
