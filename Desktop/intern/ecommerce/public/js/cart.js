setupHeader();

const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");

function renderCart() {
  const cart = getCart();

  if (!cart.length) {
    cartList.innerHTML = '<p class="empty">Your cart is empty.</p>';
    cartTotal.textContent = formatPrice(0);
    return;
  }

  cartList.innerHTML = cart
    .map(
      (item) => `
      <article class="card list-item">
        <div class="row">
          <strong>${item.name}</strong>
          <strong>${formatPrice(item.price * item.quantity)}</strong>
        </div>
        <p style="color:#6d6288">${formatPrice(item.price)} each</p>
        <div class="row">
          <input class="input" type="number" min="1" value="${item.quantity}" data-qty="${item.productId}" style="max-width:90px" />
          <button class="btn btn-ghost" data-remove="${item.productId}">Remove</button>
        </div>
      </article>
    `
    )
    .join("");

  cartTotal.textContent = `Total: ${formatPrice(getCartTotal())}`;

  cartList.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      removeFromCart(button.dataset.remove);
      renderCart();
    });
  });

  cartList.querySelectorAll("[data-qty]").forEach((input) => {
    input.addEventListener("change", () => {
      const quantity = Number(input.value);
      updateQuantity(input.dataset.qty, quantity);
      renderCart();
    });
  });
}

renderCart();
