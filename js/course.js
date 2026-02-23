/* ============================================
   RE UP — Course Page Engine
   AI Chat + Interactive Workbook
   ============================================ */

(function() {
  'use strict';

  // Detect which course we're on from the page URL
  var path = window.location.pathname;
  var courseSlug = '';
  if (path.indexOf('price-your-chair') !== -1) courseSlug = 'price-your-chair';
  else if (path.indexOf('wealth-of-barbers') !== -1) courseSlug = 'wealth-of-barbers';
  else if (path.indexOf('brand-blueprint') !== -1) courseSlug = 'brand-blueprint';

  if (!courseSlug) return;

  // ==============================
  // AI Chat
  // ==============================
  var chatForm = document.getElementById('chatForm');
  var chatInput = document.getElementById('chatInput');
  var chatMessages = document.getElementById('chatMessages');
  var chatSend = document.getElementById('chatSend');

  if (chatForm) {
    chatForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var text = chatInput.value.trim();
      if (!text) return;

      // Add user message
      appendMessage('user', text);
      chatInput.value = '';
      chatSend.disabled = true;

      // Show typing indicator
      var typingEl = showTyping();

      // Send to API
      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course: courseSlug, message: text })
      })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        removeTyping(typingEl);
        if (data.error) {
          appendMessage('assistant', 'Sorry, something went wrong. Please try again.');
        } else {
          appendMessage('assistant', data.reply);
        }
        chatSend.disabled = false;
      })
      .catch(function() {
        removeTyping(typingEl);
        appendMessage('assistant', 'Unable to connect. Please check your connection and try again.');
        chatSend.disabled = false;
      });
    });
  }

  function appendMessage(role, text) {
    var div = document.createElement('div');
    div.className = 'chat-message ' + role;

    var avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = role === 'assistant' ? 'RE' : 'You';

    var content = document.createElement('div');
    content.className = 'message-content';

    // Simple markdown-like formatting
    var formatted = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');

    content.innerHTML = '<p>' + formatted + '</p>';

    div.appendChild(avatar);
    div.appendChild(content);
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTyping() {
    var div = document.createElement('div');
    div.className = 'chat-message assistant typing';
    div.innerHTML = '<div class="message-avatar">RE</div>' +
      '<div class="message-content">' +
      '<span class="typing-dot"></span>' +
      '<span class="typing-dot"></span>' +
      '<span class="typing-dot"></span>' +
      '</div>';
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
  }

  function removeTyping(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  // ==============================
  // Workbook
  // ==============================
  var saveBtn = document.getElementById('saveWorkbook');
  var saveStatus = document.getElementById('saveStatus');
  var workbookFields = document.querySelectorAll('[data-field]');

  // Load saved workbook data on page load
  loadWorkbook();

  // Save button
  if (saveBtn) {
    saveBtn.addEventListener('click', function() {
      saveWorkbook();
    });
  }

  // Auto-save on field blur
  workbookFields.forEach(function(field) {
    field.addEventListener('blur', function() {
      saveWorkbook(true); // silent save
    });
  });

  function getWorkbookData() {
    var data = {};
    workbookFields.forEach(function(field) {
      var key = field.getAttribute('data-field');
      data[key] = field.value;
    });
    return data;
  }

  function loadWorkbook() {
    fetch('/api/workbook/' + courseSlug)
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.workbook) {
          var wb = data.workbook;
          workbookFields.forEach(function(field) {
            var key = field.getAttribute('data-field');
            if (wb[key] !== undefined && wb[key] !== null) {
              field.value = wb[key];
            }
          });
        }
      })
      .catch(function() {
        // Not logged in or no saved data — that's fine
      });
  }

  function saveWorkbook(silent) {
    var data = getWorkbookData();

    if (saveStatus && !silent) {
      saveStatus.textContent = 'Saving...';
      saveStatus.className = 'save-status saving';
    }

    fetch('/api/workbook/' + courseSlug, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: data })
    })
    .then(function(res) { return res.json(); })
    .then(function(result) {
      if (saveStatus) {
        if (result.ok) {
          saveStatus.textContent = 'Saved';
          saveStatus.className = 'save-status saved';
        } else {
          saveStatus.textContent = result.error || 'Error saving';
          saveStatus.className = 'save-status error';
        }
        // Clear status after a few seconds
        setTimeout(function() {
          saveStatus.textContent = '';
          saveStatus.className = 'save-status';
        }, 3000);
      }
    })
    .catch(function() {
      if (saveStatus) {
        saveStatus.textContent = 'Connection error';
        saveStatus.className = 'save-status error';
        setTimeout(function() {
          saveStatus.textContent = '';
          saveStatus.className = 'save-status';
        }, 3000);
      }
    });
  }

  // Load chat history
  loadChatHistory();

  function loadChatHistory() {
    fetch('/api/chat/history/' + courseSlug)
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.messages && data.messages.length > 0) {
          data.messages.forEach(function(msg) {
            appendMessage(msg.role, msg.content);
          });
        }
      })
      .catch(function() {
        // Not logged in or no history — that's fine
      });
  }

})();
