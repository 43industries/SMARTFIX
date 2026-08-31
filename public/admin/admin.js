const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const contentForm = document.getElementById('contentForm');
const contentStatus = document.getElementById('contentStatus');
const servicesEditor = document.getElementById('servicesEditor');
const addServiceBtn = document.getElementById('addServiceBtn');
const messagesList = document.getElementById('messagesList');
const messagesStatus = document.getElementById('messagesStatus');
const refreshMessagesBtn = document.getElementById('refreshMessagesBtn');
const tabs = document.querySelectorAll('.admin-tab');
const contentPanel = document.getElementById('contentPanel');
const messagesPanel = document.getElementById('messagesPanel');

let currentContent = null;

function showStatus(el, message, type) {
  el.textContent = message;
  el.className = `form-status ${type}`;
  el.hidden = false;
  if (type === 'success') {
    setTimeout(() => {
      el.hidden = true;
    }, 4000);
  }
}

function showLogin() {
  loginScreen.hidden = false;
  dashboard.hidden = true;
}

function showDashboard() {
  loginScreen.hidden = true;
  dashboard.hidden = false;
}

async function checkSession() {
  try {
    const res = await fetch('/api/session');
    const data = await res.json();
    if (data.authenticated) {
      showDashboard();
      await loadContentForm();
      return true;
    }
  } catch {
    /* fall through */
  }
  showLogin();
  return false;
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.hidden = true;
  const password = document.getElementById('adminPassword').value;
  const btn = loginForm.querySelector('button[type="submit"]');
  btn.disabled = true;

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      loginError.textContent = data.error || 'Invalid password';
      loginError.hidden = false;
      return;
    }
    loginForm.reset();
    showDashboard();
    await loadContentForm();
  } catch {
    loginError.textContent = 'Could not sign in. Please try again.';
    loginError.hidden = false;
  } finally {
    btn.disabled = false;
  }
});

logoutBtn.addEventListener('click', async () => {
  await fetch('/api/logout', { method: 'POST' });
  showLogin();
});

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    const panel = tab.dataset.tab;
    contentPanel.hidden = panel !== 'content';
    messagesPanel.hidden = panel !== 'messages';
    if (panel === 'messages') {
      loadMessages();
    }
  });
});

function createServiceRow(item, index) {
  const row = document.createElement('div');
  row.className = 'service-row';
  row.dataset.index = String(index);

  row.innerHTML = `
    <div class="service-row-header">
      <span>Service ${index + 1}</span>
      <button type="button" class="btn btn-danger btn-sm remove-service">Remove</button>
    </div>
    <div class="form-group">
      <label>Icon (emoji)</label>
      <input type="text" class="service-icon" value="${escapeAttr(item.icon || '')}" maxlength="8">
    </div>
    <div class="form-group">
      <label>Title</label>
      <input type="text" class="service-title" value="${escapeAttr(item.title || '')}">
    </div>
    <div class="form-group">
      <label>Description</label>
      <textarea class="service-text" rows="2">${escapeHtml(item.text || '')}</textarea>
    </div>
  `;

  row.querySelector('.remove-service').addEventListener('click', () => {
    row.remove();
    reindexServiceRows();
  });

  return row;
}

function reindexServiceRows() {
  servicesEditor.querySelectorAll('.service-row').forEach((row, i) => {
    row.dataset.index = String(i);
    row.querySelector('.service-row-header span').textContent = `Service ${i + 1}`;
  });
}

function renderServicesEditor(items) {
  servicesEditor.innerHTML = '';
  items.forEach((item, index) => {
    servicesEditor.appendChild(createServiceRow(item, index));
  });
}

addServiceBtn.addEventListener('click', () => {
  const count = servicesEditor.querySelectorAll('.service-row').length;
  servicesEditor.appendChild(createServiceRow({ icon: '🔧', title: '', text: '' }, count));
});

function populateContentForm(content) {
  currentContent = content;
  document.getElementById('heroTitle').value = content.hero.title;
  document.getElementById('heroSubtitle').value = content.hero.subtitle;
  document.getElementById('servicesTitle').value = content.services.title;
  document.getElementById('servicesSubtitle').value = content.services.subtitle;
  document.getElementById('aboutTitle').value = content.about.title;
  document.getElementById('aboutParagraph1').value = content.about.paragraph1;
  document.getElementById('aboutParagraph2').value = content.about.paragraph2;
  document.getElementById('aboutFeatures').value = content.about.features.join('\n');
  document.getElementById('contactPhone').value = content.contact.phone;
  document.getElementById('contactPhoneTel').value = content.contact.phoneTel;
  document.getElementById('contactEmail').value = content.contact.email;
  document.getElementById('contactAddress').value = content.contact.address;
  document.getElementById('contactHours').value = content.contact.hours;
  document.getElementById('quoteTitle').value = content.quote.title;
  document.getElementById('quoteSubtitle').value = content.quote.subtitle;
  document.getElementById('footerDescription').value = content.footer.description;
  renderServicesEditor(content.services.items);
}

async function loadContentForm() {
  const res = await fetch('/api/content');
  const content = await res.json();
  populateContentForm(content);
}

function collectContentFromForm() {
  const serviceRows = servicesEditor.querySelectorAll('.service-row');
  const items = Array.from(serviceRows).map((row) => ({
    icon: row.querySelector('.service-icon').value.trim(),
    title: row.querySelector('.service-title').value.trim(),
    text: row.querySelector('.service-text').value.trim()
  })).filter((item) => item.title || item.text);

  return {
    hero: {
      title: document.getElementById('heroTitle').value.trim(),
      subtitle: document.getElementById('heroSubtitle').value.trim()
    },
    services: {
      title: document.getElementById('servicesTitle').value.trim(),
      subtitle: document.getElementById('servicesSubtitle').value.trim(),
      items
    },
    about: {
      title: document.getElementById('aboutTitle').value.trim(),
      paragraph1: document.getElementById('aboutParagraph1').value.trim(),
      paragraph2: document.getElementById('aboutParagraph2').value.trim(),
      features: document.getElementById('aboutFeatures').value
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
    },
    contact: {
      phone: document.getElementById('contactPhone').value.trim(),
      phoneTel: document.getElementById('contactPhoneTel').value.trim(),
      email: document.getElementById('contactEmail').value.trim(),
      address: document.getElementById('contactAddress').value.trim(),
      hours: document.getElementById('contactHours').value.trim()
    },
    quote: {
      title: document.getElementById('quoteTitle').value.trim(),
      subtitle: document.getElementById('quoteSubtitle').value.trim()
    },
    footer: {
      description: document.getElementById('footerDescription').value.trim()
    }
  };
}

contentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = contentForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  contentStatus.hidden = true;

  try {
    const payload = collectContentFromForm();
    const res = await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Failed to save content');
    }
    populateContentForm(data);
    showStatus(contentStatus, 'Content saved successfully.', 'success');
  } catch (error) {
    showStatus(contentStatus, error.message || 'Failed to save content.', 'error');
  } finally {
    btn.disabled = false;
  }
});

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

async function loadMessages() {
  messagesStatus.hidden = true;
  messagesList.innerHTML = '<p class="empty-state">Loading…</p>';

  try {
    const res = await fetch('/api/messages');
    if (res.status === 401) {
      showLogin();
      return;
    }
    const data = await res.json();
    const messages = data.messages || [];

    if (!messages.length) {
      messagesList.innerHTML = '<p class="empty-state">No messages yet.</p>';
      return;
    }

    messagesList.innerHTML = '';
    messages.forEach((msg) => {
      const card = document.createElement('article');
      card.className = 'message-card';
      card.innerHTML = `
        <div class="message-card-header">
          <strong>${escapeHtml(msg.name)}</strong>
          <span class="message-date">${escapeHtml(formatDate(msg.createdAt))}</span>
        </div>
        <div class="message-meta">
          <div>Email: ${escapeHtml(msg.email)}</div>
          ${msg.phone ? `<div>Phone: ${escapeHtml(msg.phone)}</div>` : ''}
          ${msg.service ? `<div>Service: ${escapeHtml(msg.service)}</div>` : ''}
        </div>
        <div class="message-body">${escapeHtml(msg.message)}</div>
      `;
      messagesList.appendChild(card);
    });
  } catch {
    messagesList.innerHTML = '<p class="empty-state">Could not load messages.</p>';
    showStatus(messagesStatus, 'Could not load messages.', 'error');
  }
}

refreshMessagesBtn.addEventListener('click', loadMessages);

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/'/g, '&#39;');
}

checkSession();
