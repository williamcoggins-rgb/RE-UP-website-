/* ============================================================
   RE UP Report — Shared Authentication Utility
   js/auth.js

   Client-side password gate for dashboard access.
   Authenticates against server-side /api/auth endpoint.
   Same API as before so dashboard.js works without changes.
   Must be loaded BEFORE page-specific scripts (dashboard.js, article.js).
   ============================================================ */

(function () {
  'use strict';

  var TOKEN_KEY = 'reup_token';

  function getToken() {
    try { return sessionStorage.getItem(TOKEN_KEY) || null; }
    catch (e) { return null; }
  }

  function setToken(token) {
    try { sessionStorage.setItem(TOKEN_KEY, token); }
    catch (e) { /* sessionStorage unavailable */ }
  }

  function clearToken() {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem('reup_access');
    }
    catch (e) { /* sessionStorage unavailable */ }
    // Also clean up any legacy localStorage entries
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('reup_access');
    }
    catch (e) { /* localStorage unavailable */ }
  }

  /** Authenticate against the server-side auth endpoint. */
  function login(password) {
    return fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password })
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.success && data.token) {
        setToken(data.token);
        return { success: true, token: data.token };
      }
      return { success: false, error: data.error || 'Login failed' };
    })
    .catch(function (err) {
      return { success: false, error: 'Network error' };
    });
  }

  /** Check if a token exists in sessionStorage. */
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
