const registerForm = document.getElementById('registerForm');
const errorBox = document.getElementById('errorBox');

if (getToken()) {
  window.location.href = '/feed';
}

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  errorBox.textContent = '';

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    const data = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password })
    });

    setToken(data.token);
    window.location.href = '/feed';
  } catch (error) {
    errorBox.textContent = error.message;
  }
});
