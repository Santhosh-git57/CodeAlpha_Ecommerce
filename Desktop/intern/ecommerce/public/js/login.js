const loginForm = document.getElementById("loginForm");
const notice = document.getElementById("loginNotice");
const roleSwitch = document.getElementById("roleSwitch");
const roleNote = document.getElementById("roleNote");
const authPanel = document.getElementById("authPanel");
const rolePrompt = document.getElementById("rolePrompt");

let selectedRole = "";

const roleLabels = {
  admin: "Admin",
  customer: "Customer"
};

function showRoleSelection() {
  authPanel.classList.add("is-hidden");
  roleSwitch.classList.remove("is-hidden");
  rolePrompt.classList.remove("is-hidden");
}

function showAuthStep(role) {
  selectedRole = role;
  roleNote.textContent = `Login as ${roleLabels[selectedRole]}`;
  authPanel.classList.remove("is-hidden");
  roleSwitch.classList.add("is-hidden");
  rolePrompt.classList.add("is-hidden");
}

roleSwitch.addEventListener("click", (event) => {
  const card = event.target.closest("[data-role]");
  if (!card) return;

  const role = card.dataset.role;
  window.location.href = `/login.html?role=${encodeURIComponent(role)}`;
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!selectedRole) {
    notice.textContent = "Please select Admin or Customer first.";
    notice.className = "notice";
    return;
  }

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, role: selectedRole })
    });

    setAuth(data.token, data.user);
    notice.textContent = `${roleLabels[selectedRole]} login successful. Redirecting...`;
    notice.className = "notice ok";

    setTimeout(() => {
      window.location.href = selectedRole === "admin" ? "/admin.html" : "/";
    }, 500);
  } catch (error) {
    notice.textContent = error.message;
    notice.className = "notice";
  }
});

const roleFromQuery = new URLSearchParams(window.location.search).get("role");
if (roleFromQuery && roleLabels[roleFromQuery]) {
  showAuthStep(roleFromQuery);
} else {
  showRoleSelection();
}
