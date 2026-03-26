/* ============================================================
   RE UP Report — Dashboard Map + Live Data Integration
   js/dashboard-map.js

   Handles:
   1. Google Maps interactive map with shop pins
   2. Auto-loads ALL Charlotte barbershops from Google Places
   3. DB shops = colored pins (Premium/Mid-tier/Value)
   4. Google-only shops = gray secondary pins
   5. Shop detail sidebar (hours, reviews, photos)
   6. Shop directory panel with search/filter
   ============================================================ */

(function () {
  'use strict';

  // ── State ────────────────────────────────────────────────────
  var map = null;
  var markers = [];
  var infoWindow = null;
  var activeTierFilter = 'all';
  var liveShops = [];
  var isMapReady = false;
  var allShopsRegistry = [];
  var directorySearchTerm = '';
  var googleShopsLoaded = false;

  // Charlotte center
  var CLT_CENTER = { lat: 35.2271, lng: -80.8431 };

  // Tier colors — DB shops get brand colors, Google gets gray
  var TIER_COLORS = {
    'Premium':  '#e50914',
    'Mid-tier': '#f59e0b',
    'Value':    '#22c55e',
    'google':   '#888888'
  };

  // ── Map Initialization ──────────────────────────────────────

  function initMap() {
    var canvas = document.getElementById('map-canvas');
    if (!canvas) return;

    if (typeof google === 'undefined' || !google.maps) {
      canvas.innerHTML =
        '<div class="map-fallback">' +
          '<p class="map-fallback-title">Interactive Map</p>' +
          '<p class="map-fallback-desc">Configure your Google Maps API key to enable the interactive map.<br>' +
          'Shops are plotted from your competitor data + live Google Places lookups.</p>' +
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

    // Build registry from DB data
    buildStaticRegistry();

    // Plot DB shops first (colored pins)
    plotStaticShops();

    // Set up UI
    setupMapFilters();
    setupDirectory();

    // Auto-load Google Places data
    loadCharlotteShops();

    // Set up sidebar close
    var closeBtn = document.getElementById('map-sidebar-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        var sidebar = document.getElementById('map-sidebar');
        if (sidebar) sidebar.classList.remove('map-sidebar--open');
      });
    }
  }

  // ── Auto-Load Charlotte Shops from Backend ────────────────

  function loadCharlotteShops() {
    var status = document.getElementById('live-status');
    if (status) {
      status.textContent = 'Loading Charlotte barbershops...';
      status.className = 'live-status live-status--loading';
    }

    fetch('/api/places/charlotte-shops')
      .then(function (resp) { return resp.json(); })
      .then(function (data) {
        if (data.status !== 'OK' || !data.results) {
          if (status) {
            status.textContent = 'Could not load Google Places data';
            status.className = 'live-status live-status--error';
          }
          return;
        }

        liveShops = data.results;
        googleShopsLoaded = true;

        // Plot as gray secondary pins
        plotGoogleShops(data.results);

        // Merge into competitor table
        mergeWithCompetitorTable(data.results);

        if (status) {
          status.textContent = data.total + ' shops from Google Places' + (data.cached !== false ? ' (cached)' : '');
          status.className = 'live-status live-status--success';
        }
      })
      .catch(function (err) {
        if (status) {
          status.textContent = 'Error loading shops: ' + err.message;
          status.className = 'live-status live-status--error';
        }
      });
  }

  // ── Plot Static (DB) Shops ────────────────────────────────

  function plotStaticShops() {
    if (!map || !window.RE_UP_MARKET) return;

    var competitors = window.RE_UP_MARKET.COMPETITORS || [];
    var places = window.RE_UP_PLACES;

    competitors.forEach(function (shop) {
      var coords = places ? places.getZipCoords(shop.zip) : null;
      if (!coords) return;

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
        placeId: null,
        totalRatings: null,
        priceLevel: null,
        openNow: null,
        address: null
      });
    });
  }

  // ── Plot Google Places Shops (Gray Secondary Pins) ────────

  function plotGoogleShops(shops) {
    shops.forEach(function (shop) {
      // Skip if we already have a DB marker with a matching name
      var isDuplicate = markers.some(function (m) {
        if (!m._shopData || !m._shopData.name) return false;
        var dbName = m._shopData.name.toLowerCase().trim();
        var googleName = shop.name.toLowerCase().trim();
        return dbName === googleName ||
          dbName.indexOf(googleName) !== -1 ||
          googleName.indexOf(dbName) !== -1;
      });
      if (isDuplicate) return;

      addMarker({
        lat: shop.lat,
        lng: shop.lng,
        name: shop.name,
        tier: 'google',
        rating: shop.rating,
        avgCut: null,
        model: null,
        zip: null,
        neighborhood: shop.address,
        source: 'google',
        placeId: shop.place_id,
        totalRatings: shop.total_ratings,
        priceLevel: shop.price_level,
        openNow: shop.open_now,
        address: shop.address
      });
    });

    // Add to registry and refresh directory
    shops.forEach(function(shop) {
      var isDup = allShopsRegistry.some(function(s) {
        var a = s.name.toLowerCase().trim();
        var b = shop.name.toLowerCase().trim();
        return a === b || a.indexOf(b) !== -1 || b.indexOf(a) !== -1;
      });
      if (!isDup) {
        allShopsRegistry.push({
          name: shop.name,
          tier: 'google',
          rating: shop.rating,
          zip: null,
          neighborhood: shop.address,
          avgCut: null,
          model: null,
          source: 'google',
          placeId: shop.place_id,
          lat: shop.lat,
          lng: shop.lng
        });
      }
    });
    renderDirectory();
  }

  // ── Marker Management ───────────────────────────────────────

  function addMarker(data) {
    if (!map) return;

    var color = TIER_COLORS[data.tier] || TIER_COLORS['google'];
    var isGoogle = data.source === 'google';

    var marker = new google.maps.Marker({
      position: { lat: data.lat, lng: data.lng },
      map: map,
      title: data.name,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: color,
        fillOpacity: isGoogle ? 0.6 : 0.9,
        strokeColor: isGoogle ? '#aaaaaa' : '#ffffff',
        strokeWeight: isGoogle ? 1 : 1.5,
        scale: isGoogle ? 6 : 8
      },
      zIndex: isGoogle ? 1 : 10  // DB pins always on top
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

    // Dark-styled InfoWindow
    var ratingStr = data.rating && data.rating !== '---' ? data.rating + ' stars' : 'No rating';
    var extras = '';

    if (data.source === 'google') {
      // Google pin — show what Google provides
      if (data.priceLevel != null) {
        var dollars = '';
        for (var i = 0; i < data.priceLevel; i++) dollars += '$';
        extras += ' <span style="color:#e50914;">&middot;</span> ' + dollars;
      }
      if (data.totalRatings) {
        extras += ' <span style="color:#666;">(' + data.totalRatings + ')</span>';
      }
    } else {
      // DB pin — show avg cut
      if (data.avgCut && data.avgCut !== '---') {
        extras += ' <span style="color:#e50914;">&middot;</span> $' + escapeHtml(String(data.avgCut));
      }
    }

    var sourceLabel = data.source === 'google'
      ? '<div style="font-size:10px;color:#888;margin-top:3px;">Google Places</div>'
      : '<div style="font-size:10px;color:#e50914;margin-top:3px;">RE UP Database</div>';

    infoWindow.setContent(
      '<div style="background:#1a1a1a;color:#f0f0f0;font-family:sans-serif;padding:10px 12px;border-radius:6px;">' +
        '<strong style="color:#fff;font-size:13px;">' + escapeHtml(data.name) + '</strong><br>' +
        '<span style="font-size:12px;color:#999;">' + escapeHtml(ratingStr) + extras + '</span>' +
        sourceLabel +
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

    if (data.source === 'google') {
      // Google Places sidebar
      renderGoogleSidebar(content, data);
    } else {
      // DB sidebar — full enriched data
      renderDbSidebar(content, data);
    }
  }

  function renderDbSidebar(content, data) {
    var sourceTag = '<span class="map-source-tag map-source-tag--static">RE UP Database</span>';

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
    if (data.tier) {
      detailsHtml += '<div class="map-detail-row"><span class="map-detail-label">Tier</span><span>' + escapeHtml(data.tier) + '</span></div>';
    }
    if (data.model) {
      detailsHtml += '<div class="map-detail-row"><span class="map-detail-label">Model</span><span>' + escapeHtml(data.model) + '</span></div>';
    }
    detailsHtml += '</div>';

    content.innerHTML = detailsHtml;
  }

  function renderGoogleSidebar(content, data) {
    var sourceTag = '<span class="map-source-tag map-source-tag--live">Google Places</span>';

    var ratingHtml = '';
    if (data.rating) {
      ratingHtml = '<div class="map-detail-rating">' + escapeHtml(String(data.rating)) + ' <span class="map-stars">&#9733;</span>';
      if (data.totalRatings) {
        ratingHtml += ' <span style="font-size:0.75rem;color:#6b7280;">(' + data.totalRatings + ' reviews)</span>';
      }
      ratingHtml += '</div>';
    }

    var detailsHtml =
      '<div class="map-shop-header">' +
        '<h4 class="map-shop-name">' + escapeHtml(data.name) + '</h4>' +
        sourceTag +
      '</div>' +
      ratingHtml +
      '<div class="map-detail-meta">';

    if (data.address) {
      detailsHtml += '<div class="map-detail-row"><span class="map-detail-label">Address</span><span>' + escapeHtml(data.address) + '</span></div>';
    }
    if (data.priceLevel != null) {
      var dollars = '';
      for (var i = 0; i < data.priceLevel; i++) dollars += '$';
      detailsHtml += '<div class="map-detail-row"><span class="map-detail-label">Price Level</span><span>' + dollars + '</span></div>';
    }
    if (data.openNow != null) {
      detailsHtml += '<div class="map-detail-row"><span class="map-detail-label">Status</span><span>' +
        '<span class="map-open-badge map-open-badge--' + (data.openNow ? 'open' : 'closed') + '">' +
        (data.openNow ? 'Open Now' : 'Closed') + '</span></span></div>';
    }
    detailsHtml += '</div>';

    // Load full details button
    if (data.placeId && window.RE_UP_PLACES) {
      detailsHtml += '<div id="map-place-details" class="map-place-details">' +
        '<button class="btn btn-sm btn-outline" id="load-place-details">Load Hours, Reviews & Photos</button>' +
      '</div>';
    }

    content.innerHTML = detailsHtml;

    // Wire up load details
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
        renderDirectory();
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

  // ── Refresh Button (manual re-fetch) ──────────────────────

  function setupRefreshButton() {
    var btn = document.getElementById('refresh-live-data');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var icon = document.getElementById('refresh-icon');
      btn.disabled = true;
      if (icon) icon.classList.add('spinning');

      // Clear Google markers and re-fetch
      markers = markers.filter(function(m) {
        if (m._shopData && m._shopData.source === 'google') {
          m.setMap(null);
          return false;
        }
        return true;
      });

      // Remove google entries from registry
      allShopsRegistry = allShopsRegistry.filter(function(s) {
        return s.source !== 'google';
      });

      googleShopsLoaded = false;
      loadCharlotteShops();

      // Re-enable button after a delay
      setTimeout(function() {
        btn.disabled = false;
        if (icon) icon.classList.remove('spinning');
      }, 3000);
    });
  }

  // ── Merge Live Data with Competitor Table ───────────────────

  function mergeWithCompetitorTable(liveResults) {
    var tbody = document.getElementById('competitor-tbody');
    if (!tbody) return;

    var competitors = (window.RE_UP_MARKET && window.RE_UP_MARKET.COMPETITORS) || [];

    var liveByName = {};
    liveResults.forEach(function (shop) {
      liveByName[shop.name.toLowerCase().trim()] = shop;
    });

    competitors.forEach(function (comp) {
      var normalName = comp.name.toLowerCase().trim();
      var match = liveByName[normalName];
      if (!match) {
        Object.keys(liveByName).forEach(function(liveName) {
          if (!match && (liveName.indexOf(normalName) !== -1 || normalName.indexOf(liveName) !== -1)) {
            match = liveByName[liveName];
          }
        });
      }
      if (match) {
        comp._googleData = {
          place_id: match.place_id,
          rating: match.rating,
          address: match.address,
          lat: match.lat,
          lng: match.lng
        };
        comp._enriched = true;
        if ((!comp.rating || comp.rating === '---') && match.rating) {
          comp.rating = match.rating;
        }
      }
    });

    var existingRows = tbody.querySelectorAll('tr:not(.live-data-row)');
    existingRows.forEach(function (row, idx) {
      if (idx < competitors.length) {
        var comp = competitors[idx];
        var nameCell = row.querySelector('td:first-child, td[data-label="Shop Name"]');
        if (nameCell) {
          var oldBadge = nameCell.querySelector('.source-badge');
          if (oldBadge) oldBadge.remove();
          var badge = document.createElement('span');
          if (comp._enriched) {
            badge.className = 'source-badge source-badge--enriched';
            badge.textContent = 'DB + LIVE';
          } else {
            badge.className = 'source-badge source-badge--static';
            badge.textContent = 'RE UP DB';
          }
          nameCell.appendChild(badge);
        }
        if (comp._enriched && comp.rating && comp.rating !== '---') {
          var ratingCell = row.querySelector('td[data-label="Rating"], td:nth-child(5)');
          if (ratingCell && (ratingCell.textContent.trim() === '---' || ratingCell.textContent.trim() === '')) {
            ratingCell.textContent = Number(comp.rating).toFixed(1);
          }
        }
      }
    });

    var existingNames = {};
    competitors.forEach(function (c) {
      existingNames[c.name.toLowerCase().trim()] = true;
    });

    var newRows = [];
    liveResults.forEach(function (shop) {
      var lowerName = shop.name.toLowerCase().trim();
      if (existingNames[lowerName]) return;
      var isFuzzyMatch = Object.keys(existingNames).some(function(existing) {
        return existing.indexOf(lowerName) !== -1 || lowerName.indexOf(existing) !== -1;
      });
      if (isFuzzyMatch) return;
      existingNames[lowerName] = true;

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

    newRows.forEach(function (c) {
      var tr = document.createElement('tr');
      tr.className = 'live-data-row';
      var ratingStr = (c.rating && c.rating !== '---') ? Number(c.rating).toFixed(1) : '---';
      tr.innerHTML =
        '<td data-label="Shop Name">' + escapeHtml(c.name) + ' <span class="source-badge source-badge--live">GOOGLE</span></td>' +
        '<td data-label="Neighborhood">' + escapeHtml(c.neighborhood) + '</td>' +
        '<td class="cell-mono" data-label="Zip">' + escapeHtml(c.zip) + '</td>' +
        '<td class="cell-price" data-label="Avg Cut">' + escapeHtml(c.avgCut) + '</td>' +
        '<td data-label="Rating">' + escapeHtml(ratingStr) + '</td>' +
        '<td data-label="Barbers">' + escapeHtml(c.barbers) + '</td>' +
        '<td data-label="Model">' + escapeHtml(c.model) + '</td>';
      tbody.appendChild(tr);
    });
  }

  // ── Shop Directory ─────────────────────────────────────────

  function buildStaticRegistry() {
    if (!window.RE_UP_MARKET) return;
    var competitors = window.RE_UP_MARKET.COMPETITORS || [];
    competitors.forEach(function(shop) {
      allShopsRegistry.push({
        name: shop.name,
        tier: shop.tier || 'Mid-tier',
        rating: shop.rating,
        zip: shop.zip,
        neighborhood: shop.neighborhood,
        avgCut: shop.avgCut,
        model: shop.model,
        source: 'static',
        placeId: null,
        lat: null,
        lng: null
      });
    });
  }

  function setupDirectory() {
    var searchInput = document.getElementById('directory-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
      directorySearchTerm = this.value.toLowerCase().trim();
      renderDirectory();
    });

    renderDirectory();
  }

  function renderDirectory() {
    var list = document.getElementById('directory-list');
    var countEl = document.getElementById('directory-count');
    if (!list) return;

    var filtered = allShopsRegistry.filter(function(shop) {
      if (!directorySearchTerm) return true;
      var haystack = (shop.name + ' ' + (shop.zip || '') + ' ' + (shop.neighborhood || '')).toLowerCase();
      return haystack.indexOf(directorySearchTerm) !== -1;
    });

    if (activeTierFilter !== 'all') {
      filtered = filtered.filter(function(shop) {
        return shop.tier === activeTierFilter;
      });
    }

    if (countEl) {
      countEl.textContent = filtered.length + ' shop' + (filtered.length !== 1 ? 's' : '');
    }

    var html = '';
    filtered.forEach(function(shop, idx) {
      var ratingStr = (shop.rating && shop.rating !== '---') ? shop.rating + ' \u2605' : '';
      var sourceClass = shop.source === 'google' ? 'directory-item--live' : '';
      var sourceBadge = shop.source === 'google'
        ? '<span class="directory-source directory-source--live">GOOGLE</span>'
        : '<span class="directory-source directory-source--db">DB</span>';
      html += '<div class="directory-item ' + sourceClass + '" data-shop-index="' + idx + '" data-registry-name="' + escapeHtml(shop.name) + '">' +
        '<div class="directory-item-main">' +
          '<span class="directory-item-name">' + escapeHtml(shop.name) + '</span>' +
          sourceBadge +
        '</div>' +
        '<div class="directory-item-meta">' +
          (ratingStr ? '<span class="directory-item-rating">' + escapeHtml(ratingStr) + '</span>' : '') +
          (shop.zip ? '<span class="directory-item-zip">' + escapeHtml(shop.zip) + '</span>' : '') +
          '<span class="directory-item-tier directory-item-tier--' + shop.tier.toLowerCase().replace(/[- ]/g, '') + '">' + escapeHtml(shop.tier) + '</span>' +
        '</div>' +
      '</div>';
    });

    list.innerHTML = html || '<div class="directory-empty">No shops match your search.</div>';

    var items = list.querySelectorAll('.directory-item');
    items.forEach(function(item) {
      item.addEventListener('click', function() {
        var shopName = this.getAttribute('data-registry-name');
        panToShop(shopName);
      });
    });
  }

  function panToShop(shopName) {
    var target = markers.find(function(m) {
      return m._shopData && m._shopData.name === shopName;
    });
    if (target && map) {
      map.panTo(target.getPosition());
      map.setZoom(14);
      showShopInfo(target);
    }
  }

  // ── Dark Map Styles ─────────────────────────────────────────

  function getMapStyles() {
    return [
      { elementType: 'geometry', stylers: [{ color: '#0a0a0a' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#0a0a0a' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#555555' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
      { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#111111' }] },
      { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#222222' }] },
      { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#e50914' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#080810' }] },
      { featureType: 'poi', stylers: [{ visibility: 'off' }] },
      { featureType: 'transit', stylers: [{ visibility: 'off' }] },
      { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#111111' }] },
      { featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{ color: '#444444' }] },
      { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#0a0a0a' }] }
    ];
  }

  // ── Google Maps Loader ──────────────────────────────────────

  function loadGoogleMapsAPI() {
    if (typeof google !== 'undefined' && google.maps) {
      initMap();
      return;
    }

    window.__reupMapInit = function () {
      initMap();
    };

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
          initMap();
        };
        document.head.appendChild(script);
      })
      .catch(function () {
        initMap();
      });
  }

  // ── Utilities ─────────────────────────────────────────────

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
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
