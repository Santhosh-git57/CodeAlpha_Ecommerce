setupHeader();

const form = document.getElementById("checkoutForm");
const notice = document.getElementById("checkoutNotice");
const ordersList = document.getElementById("ordersList");

function requireLogin() {
  if (!getToken()) {
    window.location.href = "/login.html";
    return false;
  }
  return true;
}

async function loadOrders() {
  if (!requireLogin()) return;

  try {
    const orders = await apiRequest("/orders/my");

    if (!orders.length) {
      ordersList.innerHTML = '<p class="empty">No orders yet.</p>';
      return;
    }

    ordersList.innerHTML = orders
      .map(
        (order) => `
        <article class="card list-item">
          <div class="row">
            <strong>Order ${order._id.slice(-6).toUpperCase()}</strong>
            <strong>${formatPrice(order.totalAmount)}</strong>
          </div>
          <p style="color:#6d6288">${order.items.length} item(s) • ${order.status}</p>
          <p style="color:#6d6288">${new Date(order.createdAt).toLocaleString()}</p>
        </article>
      `
      )
      .join("");
  } catch (error) {
    ordersList.innerHTML = `<p class="empty">${error.message}</p>`;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!requireLogin()) return;

  const cart = getCart();
  if (!cart.length) {
    notice.textContent = "Your cart is empty.";
    notice.className = "notice";
    return;
  }

  const shippingAddress = document.getElementById("address").value.trim();
  if (shippingAddress.length < 5) {
    notice.textContent = "Please enter valid address.";
    notice.className = "notice";
    return;
  }

  const items = cart.map((item) => ({
    productId: item.productId,
    quantity: item.quantity
  }));

  try {
    await apiRequest("/orders", {
      method: "POST",
      body: JSON.stringify({ items, shippingAddress })
    });

    setCart([]);
    form.reset();
    notice.textContent = "Order placed successfully.";
    notice.className = "notice ok";
    loadOrders();
  } catch (error) {
    notice.textContent = error.message;
    notice.className = "notice";
  }
});

loadOrders();
