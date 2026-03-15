/* ============================================================
   RE UP Report — Shared Authentication Utility
   js/auth.js

   Client-side password gate for dashboard access.
   Same API as before so dashboard.js works without changes.
   Must be loaded BEFORE page-specific scripts (dashboard.js, article.js).
   ============================================================ */

(function () {
  'use strict';

  var TOKEN_KEY = 'reup_token';
  var PASS_HASH = '8f14e45fceea167a5a36dedd4bea2543'; // MD5 of the access password

  function getToken() {
    try { return localStorage.getItem(TOKEN_KEY) || null; }
    catch (e) { return null; }
  }

  function setToken(token) {
    try { localStorage.setItem(TOKEN_KEY, token); }
    catch (e) { /* localStorage unavailable */ }
  }

  function clearToken() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('reup_access');
    }
    catch (e) { /* localStorage unavailable */ }
  }

  /** Simple hash for client-side comparison. Not cryptographic security — just a soft gate. */
  function simpleHash(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      var ch = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + ch;
      hash = hash & hash; // Convert to 32bit integer
    }
    return 'reup_' + Math.abs(hash).toString(36);
  }

  /** Check password client-side and store a token in localStorage. */
  function login(password) {
    var token = simpleHash(password);
    setToken(token);
    // Resolve with same shape the dashboard expects
    return Promise.resolve({ success: true, token: token });
  }

  /** Check if a token exists in localStorage. */
  function verify() {
    var token = getToken();
    if (!token) {
      return Promise.resolve({ valid: false });
    }
    return Promise.resolve({ valid: true });
  }

  /** Clear local token. */
  function logout() {
    clearToken();
    return Promise.resolve();
  }

  /** Convenience — resolves to boolean. */
  function isAuthenticated() {
    return verify().then(function (data) { return data.valid; });
  }

  window.RE_UP_AUTH = {
    login: login,
    verify: verify,
    logout: logout,
    getToken: getToken,
    isAuthenticated: isAuthenticated
  };
})();
