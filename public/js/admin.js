setupHeader();

const user = getUser();
if (!user || user.role !== "admin") {
  window.location.href = "/login.html?role=admin";
}

const usersList = document.getElementById("usersList");
const cartsList = document.getElementById("cartsList");
const ordersList = document.getElementById("ordersList");
const productsList = document.getElementById("productsList");
const productForm = document.getElementById("productForm");
const productNotice = document.getElementById("productNotice");

function safeText(value) {
  return String(value ?? "");
}

async function loadUsers() {
  try {
    const users = await apiRequest("/admin/users");
    const customers = users.filter((entry) => entry.role === "customer");

    if (!customers.length) {
      usersList.innerHTML = '<p class="empty">No customers found.</p>';
      return;
    }

    usersList.innerHTML = customers
      .map(
        (entry) => `
        <article class="admin-item">
          <strong>${safeText(entry.name)}</strong>
          <span>${safeText(entry.email)}</span>
          <small>${new Date(entry.createdAt).toLocaleDateString()}</small>
        </article>
      `
      )
      .join("");
  } catch (error) {
    usersList.innerHTML = `<p class="empty">${error.message}</p>`;
  }
}

async function loadCarts() {
  try {
    const carts = await apiRequest("/admin/carts");
    if (!carts.length) {
      cartsList.innerHTML = '<p class="empty">No active carts.</p>';
      return;
    }

    cartsList.innerHTML = carts
      .map((cart) => {
        const items = cart.items
          .map((item) => `${item.product?.name || "Product"} x ${item.quantity}`)
          .join(", ");

        return `
          <article class="admin-item">
            <strong>${safeText(cart.user?.name || "Unknown")}</strong>
            <span>${safeText(cart.user?.email || "")}</span>
            <small>${items}</small>
          </article>
        `;
      })
      .join("");
  } catch (error) {
    cartsList.innerHTML = `<p class="empty">${error.message}</p>`;
  }
}

async function loadOrders() {
  try {
    const orders = await apiRequest("/admin/orders");
    if (!orders.length) {
      ordersList.innerHTML = '<p class="empty">No orders found.</p>';
      return;
    }

    ordersList.innerHTML = orders
      .map(
        (order) => `
        <article class="admin-item">
          <div class="row">
            <strong>${safeText(order.user?.name || "Customer")}</strong>
            <strong>${formatPrice(order.totalAmount)}</strong>
          </div>
          <small>${safeText(order.user?.email || "")}</small>
          <small>${order.items.map((item) => `${item.name} x ${item.quantity}`).join(", ")}</small>
          <div class="row admin-row-gap">
            <select class="input admin-status" data-order="${order._id}">
              ${["Placed", "Processing", "Shipped", "Delivered"]
                .map((status) => `<option value="${status}" ${order.status === status ? "selected" : ""}>${status}</option>`)
                .join("")}
            </select>
            <button class="btn btn-ghost" data-update="${order._id}">Update</button>
          </div>
        </article>
      `
      )
      .join("");

    ordersList.querySelectorAll("[data-update]").forEach((button) => {
      button.addEventListener("click", async () => {
        const select = ordersList.querySelector(`select[data-order="${button.dataset.update}"]`);
        try {
          await apiRequest(`/admin/orders/${button.dataset.update}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status: select.value })
          });
          loadOrders();
        } catch (_error) {
          // Keep UI simple for now; reload will reflect errors in console network tab.
        }
      });
    });
  } catch (error) {
    ordersList.innerHTML = `<p class="empty">${error.message}</p>`;
  }
}

async function loadProducts() {
  try {
    const products = await apiRequest("/admin/products");
    if (!products.length) {
      productsList.innerHTML = '<p class="empty">No products found.</p>';
      return;
    }

    productsList.innerHTML = products
      .map(
        (product) => `
        <article class="admin-item">
          <div class="row">
            <strong>${safeText(product.name)}</strong>
            <strong>${formatPrice(product.price)}</strong>
          </div>
          <small>${safeText(product.category)} • Stock: ${safeText(product.stock)}</small>
          <div class="row admin-row-gap">
            <button class="btn btn-ghost" data-stock="${product._id}">+1 Stock</button>
            <button class="btn btn-ghost" data-delete="${product._id}">Delete</button>
          </div>
        </article>
      `
      )
      .join("");

    productsList.querySelectorAll("[data-delete]").forEach((button) => {
      button.addEventListener("click", async () => {
        await apiRequest(`/admin/products/${button.dataset.delete}`, { method: "DELETE" });
        loadProducts();
      });
    });

    productsList.querySelectorAll("[data-stock]").forEach((button) => {
      button.addEventListener("click", async () => {
        const productsLatest = await apiRequest("/admin/products");
        const found = productsLatest.find((entry) => entry._id === button.dataset.stock);
        if (!found) return;
        await apiRequest(`/admin/products/${button.dataset.stock}`, {
          method: "PUT",
          body: JSON.stringify({ stock: Number(found.stock) + 1 })
        });
        loadProducts();
      });
    });
  } catch (error) {
    productsList.innerHTML = `<p class="empty">${error.message}</p>`;
  }
}

productForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    name: document.getElementById("productName").value.trim(),
    category: document.getElementById("productCategory").value.trim(),
    price: Number(document.getElementById("productPrice").value),
    stock: Number(document.getElementById("productStock").value),
    image: document.getElementById("productImage").value.trim(),
    description: document.getElementById("productDescription").value.trim()
  };

  try {
    await apiRequest("/admin/products", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    productForm.reset();
    productNotice.textContent = "Product added.";
    productNotice.className = "notice ok";
    loadProducts();
  } catch (error) {
    productNotice.textContent = error.message;
    productNotice.className = "notice";
  }
});

loadUsers();
loadCarts();
loadOrders();
loadProducts();
