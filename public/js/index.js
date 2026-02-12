setupHeader();

const productGrid = document.getElementById("productGrid");
const categoryFilter = document.getElementById("categoryFilter");
const searchInput = document.getElementById("searchInput");

let products = [];

function renderProducts(list) {
  if (!list.length) {
    productGrid.innerHTML = '<div class="card empty">No products found.</div>';
    return;
  }

  productGrid.innerHTML = list
    .map(
      (product) => `
      <article class="card product-card">
        <img src="${product.image}" alt="${product.name}" />
        <div class="product-body">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="row">
            <strong>${formatPrice(product.price)}</strong>
            <small>${product.category}</small>
          </div>
          <div class="row" style="margin-top:0.6rem">
            <a class="btn btn-ghost" href="/product.html?id=${product._id}">Details</a>
            <button class="btn btn-primary" data-id="${product._id}">Add</button>
          </div>
        </div>
      </article>
    `
    )
    .join("");

  productGrid.querySelectorAll("button[data-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const product = products.find((entry) => entry._id === button.dataset.id);
      if (!product) return;
      addToCart(product, 1);
      button.textContent = "Added";
      setTimeout(() => {
        button.textContent = "Add";
      }, 700);
    });
  });
}

function applyFilters() {
  const category = categoryFilter.value;
  const keyword = searchInput.value.trim().toLowerCase();

  const filtered = products.filter((product) => {
    const categoryMatch = category === "All" || product.category === category;
    const keywordMatch =
      product.name.toLowerCase().includes(keyword) ||
      product.description.toLowerCase().includes(keyword);
    return categoryMatch && keywordMatch;
  });

  renderProducts(filtered);
}

async function loadProducts() {
  try {
    products = await apiRequest("/products");

    const categories = ["All", ...new Set(products.map((product) => product.category))];
    categoryFilter.innerHTML = categories
      .map((category) => `<option value="${category}">${category}</option>`)
      .join("");

    renderProducts(products);
  } catch (error) {
    productGrid.innerHTML = `<div class="card empty">${error.message}</div>`;
  }
}

categoryFilter.addEventListener("change", applyFilters);
searchInput.addEventListener("input", applyFilters);

loadProducts();
