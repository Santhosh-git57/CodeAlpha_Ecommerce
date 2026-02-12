const products = [
  {
    id: 1,
    name: "Urban Knit Polo",
    category: "Men",
    price: 1599,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    description: "Breathable knit polo for all-day comfort with a refined fit."
  },
  {
    id: 2,
    name: "Minimal Shift Dress",
    category: "Women",
    price: 1899,
    image: "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=800&q=80",
    description: "Elegant silhouette with soft fabric and subtle movement."
  },
  {
    id: 3,
    name: "Motion Runner",
    category: "Shoes",
    price: 2499,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    description: "Cushioned, lightweight sneakers made for city and travel."
  },
  {
    id: 4,
    name: "Smart Carry Tote",
    category: "Accessories",
    price: 1199,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    description: "Structured tote with secure zip and utility compartments."
  },
  {
    id: 5,
    name: "Coastal Linen Shirt",
    category: "Men",
    price: 1399,
    image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=800&q=80",
    description: "Relaxed linen shirt that keeps you cool and polished."
  },
  {
    id: 6,
    name: "Contour Crop Jacket",
    category: "Women",
    price: 2299,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
    description: "Modern cropped layer with clean tailoring and detail work."
  },
  {
    id: 7,
    name: "Trail Utility Sneaker",
    category: "Shoes",
    price: 2799,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
    description: "Multi-surface grip with a bold everyday profile."
  },
  {
    id: 8,
    name: "Luxe Chrono Watch",
    category: "Accessories",
    price: 3499,
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80",
    description: "Timeless analog watch with premium strap finish."
  }
];

const loginGate = document.getElementById("loginGate");
const storeApp = document.getElementById("storeApp");
const rolePills = document.getElementById("rolePills");
const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginMessage = document.getElementById("loginMessage");
const logoutButton = document.getElementById("logoutButton");
const mainNav = document.getElementById("mainNav");
const cartButton = document.getElementById("cartButton");

const productGrid = document.getElementById("productGrid");
const chipsContainer = document.getElementById("categoryChips");
const searchInput = document.getElementById("searchInput");
const cartCount = document.getElementById("cartCount");
const quickView = document.getElementById("quickView");
const closeModal = document.getElementById("closeModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalPrice = document.getElementById("modalPrice");

const credentials = {
  customer: { email: "user@yashcart.com", password: "user123" },
  admin: { email: "admin@yashcart.com", password: "admin123" }
};

let selectedRole = "customer";
let cartItems = 0;
let selectedCategory = "All";

const categories = ["All", ...new Set(products.map((product) => product.category))];

function setRole(role) {
  selectedRole = role;
  rolePills.querySelectorAll(".role-pill").forEach((button) => {
    button.classList.toggle("active", button.dataset.role === role);
  });
  loginMessage.textContent = "";
  loginMessage.className = "login-message";
}

function openStore() {
  loginGate.classList.add("hidden");
  storeApp.classList.remove("hidden");
  logoutButton.classList.remove("hidden");
  mainNav.classList.remove("hidden");
  cartButton.classList.remove("hidden");
}

function closeStore() {
  storeApp.classList.add("hidden");
  loginGate.classList.remove("hidden");
  logoutButton.classList.add("hidden");
  mainNav.classList.add("hidden");
  cartButton.classList.add("hidden");
}

rolePills.addEventListener("click", (event) => {
  const target = event.target.closest(".role-pill");
  if (!target) return;
  setRole(target.dataset.role);
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = loginEmail.value.trim().toLowerCase();
  const password = loginPassword.value.trim();
  const account = credentials[selectedRole];

  if (email !== account.email || password !== account.password) {
    loginMessage.textContent = "Invalid email or password.";
    loginMessage.className = "login-message error";
    return;
  }

  loginMessage.textContent =
    selectedRole === "admin"
      ? "Admin logged in. Admin panel can be added in next step."
      : "Customer logged in successfully.";
  loginMessage.className = "login-message success";

  openStore();
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
});

logoutButton.addEventListener("click", () => {
  closeStore();
  loginForm.reset();
  setRole("customer");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function renderChips() {
  chipsContainer.innerHTML = categories
    .map(
      (category) =>
        `<button class="chip ${category === selectedCategory ? "active" : ""}" data-category="${category}">${category}</button>`
    )
    .join("");
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function getFilteredProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  return products.filter((product) => {
    const categoryMatch = selectedCategory === "All" || product.category === selectedCategory;
    const textMatch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm);

    return categoryMatch && textMatch;
  });
}

function renderProducts() {
  const list = getFilteredProducts();

  if (list.length === 0) {
    productGrid.innerHTML = "<p>No products found. Try another keyword.</p>";
    return;
  }

  productGrid.innerHTML = list
    .map(
      (product) => `
      <article class="product-card">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <div class="product-body">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="price-row">
            <span>${product.category}</span>
            <strong>${formatPrice(product.price)}</strong>
          </div>
          <div class="card-actions">
            <button class="add-btn" data-action="add" data-id="${product.id}">Add</button>
            <button class="view-btn" data-action="view" data-id="${product.id}">View</button>
          </div>
        </div>
      </article>
    `
    )
    .join("");
}

function openQuickView(productId) {
  const product = products.find((item) => item.id === Number(productId));
  if (!product) return;

  modalImage.src = product.image;
  modalImage.alt = product.name;
  modalTitle.textContent = product.name;
  modalDesc.textContent = product.description;
  modalPrice.textContent = formatPrice(product.price);
  quickView.classList.remove("hidden");
  quickView.setAttribute("aria-hidden", "false");
}

function closeQuickView() {
  quickView.classList.add("hidden");
  quickView.setAttribute("aria-hidden", "true");
}

chipsContainer.addEventListener("click", (event) => {
  const target = event.target.closest(".chip");
  if (!target) return;

  selectedCategory = target.dataset.category;
  renderChips();
  renderProducts();
});

searchInput.addEventListener("input", renderProducts);

productGrid.addEventListener("click", (event) => {
  const actionButton = event.target.closest("button[data-action]");
  if (!actionButton) return;

  const { action, id } = actionButton.dataset;

  if (action === "add") {
    cartItems += 1;
    cartCount.textContent = String(cartItems);
  }

  if (action === "view") {
    openQuickView(id);
  }
});

quickView.addEventListener("click", (event) => {
  if (event.target === quickView) {
    closeQuickView();
  }
});

closeModal.addEventListener("click", closeQuickView);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeQuickView();
  }
});

renderChips();
renderProducts();
closeStore();
setRole("customer");


