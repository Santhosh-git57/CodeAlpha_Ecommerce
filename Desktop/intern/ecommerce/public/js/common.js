const API_BASE = "/api";

function getToken() {
  return localStorage.getItem("token") || "";
}

function getUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

function setAuth(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("cart");
}

function getCart() {
  const raw = localStorage.getItem("cart");
  return raw ? JSON.parse(raw) : [];
}

function setCart(items) {
  localStorage.setItem("cart", JSON.stringify(items));
  updateCartCount();
  syncCartToServer();
}

function addToCart(product, quantity = 1) {
  const cart = getCart();
  const found = cart.find((item) => item.productId === product._id);

  if (found) {
    found.quantity += quantity;
  } else {
    cart.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity
    });
  }

  setCart(cart);
}

function removeFromCart(productId) {
  setCart(getCart().filter((item) => item.productId !== productId));
}

function updateQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find((entry) => entry.productId === productId);
  if (!item) return;

  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  item.quantity = quantity;
  setCart(cart);
}

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function updateCartCount() {
  const countElement = document.getElementById("cartCount");
  if (!countElement) return;

  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  countElement.textContent = String(count);
}

function cartFromServerShape(serverCart) {
  if (!serverCart || !Array.isArray(serverCart.items)) return [];

  return serverCart.items
    .filter((item) => item.product)
    .map((item) => ({
      productId: item.product._id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image || "",
      quantity: item.quantity
    }));
}

async function syncCartToServer() {
  const token = getToken();
  if (!token) return;

  const items = getCart().map((item) => ({
    productId: item.productId,
    quantity: item.quantity
  }));

  try {
    await apiRequest("/cart/sync", {
      method: "PUT",
      body: JSON.stringify({ items })
    });
  } catch (_error) {
    // Silent by design: cart stays usable offline/local even if sync fails.
  }
}

async function loadCartFromServer() {
  const token = getToken();
  if (!token) return;

  try {
    const serverCart = await apiRequest("/cart");
    const localCart = cartFromServerShape(serverCart);
    localStorage.setItem("cart", JSON.stringify(localCart));
    updateCartCount();
  } catch (_error) {
    // Ignore sync errors and keep local cart.
  }
}

function setupHeader() {
  updateCartCount();

  const authLink = document.getElementById("authLink");
  const logoutBtn = document.getElementById("logoutBtn");
  const user = getUser();

  if (authLink) {
    authLink.textContent = user ? `Hi, ${user.name}` : "Login";
    authLink.href = user ? "#" : "/login.html";
    if (user) {
      authLink.addEventListener("click", (event) => {
        event.preventDefault();
      });
    }
  }

  if (logoutBtn) {
    logoutBtn.style.display = user ? "inline-flex" : "none";
    logoutBtn.addEventListener("click", () => {
      clearAuth();
      window.location.href = "/login.html";
    });
  }

  loadCartFromServer();
}

async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
