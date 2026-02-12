setupHeader();

const registerForm = document.getElementById("registerForm");
const notice = document.getElementById("registerNotice");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role: "customer" })
    });

    notice.textContent = "Registration successful. Redirecting to login...";
    notice.className = "notice ok";

    setTimeout(() => {
      window.location.href = "/login.html";
    }, 700);
  } catch (error) {
    notice.textContent = error.message;
    notice.className = "notice";
  }
});

