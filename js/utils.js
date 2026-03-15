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
      '.reup-waitlist-form input { padding:10px 14px; border:1px solid #333; border-radius:6px; background:#1a1a1a; color:#fff; font-family:Inter,sans-serif; font-size:0.95rem; flex:1 1 200px; min-width:0; outline:none; }' +
      '.reup-waitlist-form input[name="zip"] { flex:0 1 120px; min-width:100px; }' +
      '.reup-waitlist-form input:focus { border-color:#e50914; }' +
      '.reup-waitlist-form input::placeholder { color:#777; }' +
      '.reup-waitlist-btn { padding:10px 20px; border:none; border-radius:6px; background:#e50914; color:#fff; font-family:Inter,sans-serif; font-size:0.95rem; font-weight:600; cursor:pointer; white-space:nowrap; }' +
      '.reup-waitlist-btn:hover { background:#c30812; }' +
      '.reup-waitlist-msg { text-align:center; margin-top:12px; font-family:Inter,sans-serif; font-size:0.95rem; }' +
      '.reup-waitlist-msg--prompt { color:#ccc; }' +
      '.reup-waitlist-msg--ok { color:#4caf50; }' +
      '.reup-waitlist-msg--err { color:#e50914; }' +
      '.reup-coming-soon { display:inline-block; font-size:0.75rem; background:#e50914; color:#fff; padding:2px 8px; border-radius:4px; margin-left:6px; vertical-align:middle; font-weight:600; letter-spacing:0.02em; }' +
      '@media(max-width:600px){ .reup-waitlist-form input, .reup-waitlist-form .reup-waitlist-btn { flex:1 1 100%; } }';
    document.head.appendChild(style);
  }

  /**
   * showWaitlistForm(containerEl)
   * Replaces the contents of containerEl with a 4-field waitlist form.
   * Stores entries in localStorage under `reup_waitlist` as a JSON array.
   */
  function showWaitlistForm(containerEl) {
    injectWaitlistStyles();

    containerEl.innerHTML =
      '<p class="reup-waitlist-msg reup-waitlist-msg--prompt">Subscriptions launching soon. Sign up for early access.</p>' +
      '<form class="reup-waitlist-form" autocomplete="on">' +
        '<input type="text" name="name" placeholder="Your name" required>' +
        '<input type="email" name="email" placeholder="your@email.com" required>' +
        '<input type="tel" name="phone" placeholder="Phone (optional)">' +
        '<input type="text" name="zip" placeholder="Zip code" required pattern="[0-9]{5}" maxlength="5">' +
        '<button type="submit" class="reup-waitlist-btn">Notify Me</button>' +
      '</form>';

    var form = containerEl.querySelector('.reup-waitlist-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (form.querySelector('input[name="name"]').value || '').trim();
      var email = (form.querySelector('input[name="email"]').value || '').trim();
      var phone = (form.querySelector('input[name="phone"]').value || '').trim();
      var zip = (form.querySelector('input[name="zip"]').value || '').trim();

      var msgEl = containerEl.querySelector('.reup-waitlist-msg');

      if (!name) {
        msgEl.textContent = 'Please enter your name.';
        msgEl.className = 'reup-waitlist-msg reup-waitlist-msg--err';
        return;
      }
      if (!email || email.indexOf('@') < 1) {
        msgEl.textContent = 'Please enter a valid email address.';
        msgEl.className = 'reup-waitlist-msg reup-waitlist-msg--err';
        return;
      }
      if (!zip || !/^[0-9]{5}$/.test(zip)) {
        msgEl.textContent = 'Please enter a valid 5-digit zip code.';
        msgEl.className = 'reup-waitlist-msg reup-waitlist-msg--err';
        return;
      }

      // Disable button while submitting
      var btn = form.querySelector('.reup-waitlist-btn');
      btn.disabled = true;
      btn.textContent = 'Submitting…';

      fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, email: email, phone: phone, zip: zip })
      })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          containerEl.innerHTML =
            '<p class="reup-waitlist-msg reup-waitlist-msg--ok">' +
              (data.message === 'already_on_list'
                ? "You\u2019re already on the list. We\u2019ll be in touch soon."
                : "You\u2019re on the list. Check your email \u2014 we just sent you a welcome.") +
            '</p>';
        } else {
          msgEl.textContent = data.error || 'Something went wrong. Try again.';
          msgEl.className = 'reup-waitlist-msg reup-waitlist-msg--err';
          btn.disabled = false;
          btn.textContent = 'Notify Me';
        }
      })
      .catch(function () {
        msgEl.textContent = 'Network error \u2014 please try again.';
        msgEl.className = 'reup-waitlist-msg reup-waitlist-msg--err';
        btn.disabled = false;
        btn.textContent = 'Notify Me';
      });
    });
  }

  window.showWaitlistForm = showWaitlistForm;
})();
