/* ============================================================
   RE UP Report — Shared Authentication Utility
   js/auth.js

   Provides window.RE_UP_AUTH for JWT-based authentication.
   Must be loaded BEFORE page-specific scripts (dashboard.js, article.js).
   ============================================================ */

(function () {
  'use strict';

  var TOKEN_KEY = 'reup_token';

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
      localStorage.removeItem('reup_access'); // clean up legacy key
    }
    catch (e) { /* localStorage unavailable */ }
  }

  /** POST credentials to server, receive JWT on success. */
  function login(email, password) {
    return fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password })
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.success && data.token) {
        setToken(data.token);
      }
      return data;
    });
  }

  /** Verify current token against server. Resolves { valid: true/false }. */
  function verify() {
    var token = getToken();
    if (!token) {
      return Promise.resolve({ valid: false });
    }
    return fetch('/api/auth/verify', {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (!data.valid) {
        clearToken();
      }
      return data;
    })
    .catch(function () {
      return { valid: false };
    });
  }

  /** Clear local token (JWT is stateless — no server invalidation needed). */
  function logout() {
    clearToken();
    return fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).catch(function () { /* ignore network errors on logout */ });
  }

  /** Convenience — resolves to boolean. */
  function isAuthenticated() {
    return verify().then(function (data) { return data.valid; });
  }

  /** Get authorization header for API calls. */
  function authHeaders() {
    var token = getToken();
    var headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
    }
    return headers;
  }

  window.RE_UP_AUTH = {
    login: login,
    verify: verify,
    logout: logout,
    getToken: getToken,
    setToken: setToken,
    clearToken: clearToken,
    isAuthenticated: isAuthenticated,
    authHeaders: authHeaders
  };
})();
