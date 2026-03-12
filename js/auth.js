/* ============================================================
   RE UP Report — Shared Authentication Utility
   js/auth.js

   Provides window.RE_UP_AUTH for server-side token authentication.
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

  /**
   * POST password to server, receive session token on success.
   * Returns a Promise-like callback pattern using plain XHR for broad compat.
   * Usage: RE_UP_AUTH.login(password, function(err, data) { ... })
   */
  function login(password, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/auth/login', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      try {
        var resp = JSON.parse(xhr.responseText);
        if (xhr.status === 200 && resp.success && resp.token) {
          setToken(resp.token);
          callback(null, resp);
        } else {
          callback(resp.error || 'Login failed', null);
        }
      } catch (e) {
        callback('Network error', null);
      }
    };
    xhr.send(JSON.stringify({ password: password }));
  }

  /**
   * Verify current token against server.
   * Usage: RE_UP_AUTH.verify(function(valid) { ... })
   */
  function verify(callback) {
    var token = getToken();
    if (!token) {
      callback(false);
      return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/auth/verify', true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      try {
        var resp = JSON.parse(xhr.responseText);
        if (xhr.status === 200 && resp.valid) {
          callback(true);
        } else {
          clearToken();
          callback(false);
        }
      } catch (e) {
        callback(false);
      }
    };
    xhr.send();
  }

  /**
   * Invalidate token server-side and clear local storage.
   * Usage: RE_UP_AUTH.logout(function() { ... })
   */
  function logout(callback) {
    var token = getToken();
    if (!token) {
      clearToken();
      if (callback) callback();
      return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/auth/logout', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      clearToken();
      if (callback) callback();
    };
    xhr.send();
  }

  /**
   * Async convenience — checks server for valid session.
   * Usage: RE_UP_AUTH.isAuthenticated(function(authed) { ... })
   */
  function isAuthenticated(callback) {
    verify(callback);
  }

  // Expose on window
  window.RE_UP_AUTH = {
    login: login,
    verify: verify,
    logout: logout,
    getToken: getToken,
    isAuthenticated: isAuthenticated
  };
})();
