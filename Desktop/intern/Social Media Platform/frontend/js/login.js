const loginForm = document.getElementById('loginForm');
const errorBox = document.getElementById('errorBox');

if (getToken()) {
  window.location.href = '/feed';
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  errorBox.textContent = '';

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    setToken(data.token);
    window.location.href = '/feed';
  } catch (error) {
    errorBox.textContent = error.message;
  }
});
