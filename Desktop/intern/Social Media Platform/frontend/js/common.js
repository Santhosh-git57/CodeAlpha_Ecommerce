const API_BASE = '';

function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  localStorage.setItem('token', token);
}

function clearToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
}

async function apiRequest(url, options = {}) {
  const token = getToken();
  const headers = options.headers || {};

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(API_BASE + url, {
    ...options,
    headers
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const rawText = await response.text();

  let data = {};
  if (rawText) {
    if (isJson) {
      try {
        data = JSON.parse(rawText);
      } catch (_error) {
        data = {};
      }
    } else {
      data = { message: rawText };
    }
  }

  if (!response.ok) {
    const message = data.message
      ? String(data.message).replace(/<[^>]*>/g, '').trim()
      : `Request failed (${response.status})`;
    throw new Error(message || `Request failed (${response.status})`);
  }

  return data;
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = '/login';
  }
}

async function logout() {
  try {
    if (getToken()) {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    }
  } catch (_error) {
  } finally {
    clearToken();
    window.location.href = '/login';
  }
}

function escapeHTML(value) {
  const div = document.createElement('div');
  div.innerText = value;
  return div.innerHTML;
}
