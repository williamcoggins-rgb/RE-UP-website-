(function () {
  'use strict';

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  window.escapeHtml = escapeHtml;

  /* ---- Waitlist form (replaces fake signup flow) ---- */

  // Inject waitlist styles once
  var waitlistStylesInjected = false;
  function injectWaitlistStyles() {
    if (waitlistStylesInjected) return;
    waitlistStylesInjected = true;
    var style = document.createElement('style');
    style.textContent =
      '.reup-waitlist-form { display:flex; gap:8px; margin-top:12px; flex-wrap:wrap; justify-content:center; }' +
      '.reup-waitlist-form input[type="email"] { padding:10px 14px; border:1px solid #333; border-radius:6px; background:#1a1a1a; color:#fff; font-family:Inter,sans-serif; font-size:0.95rem; flex:1 1 220px; min-width:0; outline:none; }' +
      '.reup-waitlist-form input[type="email"]:focus { border-color:#e50914; }' +
      '.reup-waitlist-form input[type="email"]::placeholder { color:#777; }' +
      '.reup-waitlist-btn { padding:10px 20px; border:none; border-radius:6px; background:#e50914; color:#fff; font-family:Inter,sans-serif; font-size:0.95rem; font-weight:600; cursor:pointer; white-space:nowrap; }' +
      '.reup-waitlist-btn:hover { background:#c30812; }' +
      '.reup-waitlist-msg { text-align:center; margin-top:12px; font-family:Inter,sans-serif; font-size:0.95rem; }' +
      '.reup-waitlist-msg--prompt { color:#ccc; }' +
      '.reup-waitlist-msg--ok { color:#4caf50; }' +
      '.reup-waitlist-msg--err { color:#e50914; }' +
      '.reup-coming-soon { display:inline-block; font-size:0.75rem; background:#e50914; color:#fff; padding:2px 8px; border-radius:4px; margin-left:6px; vertical-align:middle; font-weight:600; letter-spacing:0.02em; }';
    document.head.appendChild(style);
  }

  /**
   * showWaitlistForm(containerEl)
   * Replaces the contents of containerEl with an honest waitlist email form.
   * Stores emails in localStorage under `reup_waitlist` as a JSON array.
   */
  function showWaitlistForm(containerEl) {
    injectWaitlistStyles();

    containerEl.innerHTML =
      '<p class="reup-waitlist-msg reup-waitlist-msg--prompt">Subscriptions launching soon. Enter your email to get early access.</p>' +
      '<form class="reup-waitlist-form" autocomplete="on">' +
        '<input type="email" name="email" placeholder="your@email.com" required>' +
        '<button type="submit" class="reup-waitlist-btn">Notify Me</button>' +
      '</form>';

    var form = containerEl.querySelector('.reup-waitlist-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var email = (input.value || '').trim();
      if (!email || email.indexOf('@') < 1) {
        containerEl.querySelector('.reup-waitlist-msg').textContent = 'Please enter a valid email address.';
        containerEl.querySelector('.reup-waitlist-msg').className = 'reup-waitlist-msg reup-waitlist-msg--err';
        return;
      }

      // Store in localStorage
      var list = [];
      try { list = JSON.parse(localStorage.getItem('reup_waitlist')) || []; } catch (ex) { list = []; }
      if (list.indexOf(email) === -1) {
        list.push(email);
        localStorage.setItem('reup_waitlist', JSON.stringify(list));
      }

      // Show honest confirmation
      containerEl.innerHTML =
        '<p class="reup-waitlist-msg reup-waitlist-msg--ok">' +
          "You\u2019re on the list. We\u2019ll notify you when subscriptions go live." +
        '</p>';
    });
  }

  window.showWaitlistForm = showWaitlistForm;
})();
