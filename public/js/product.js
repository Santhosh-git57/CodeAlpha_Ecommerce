setupHeader();

const detailWrap = document.getElementById("detailWrap");
const id = new URLSearchParams(window.location.search).get("id");

async function loadProduct() {
  if (!id) {
    detailWrap.innerHTML = '<p class="empty">Product id missing.</p>';
    return;
  }

  try {
    const product = await apiRequest(`/products/${id}`);

    detailWrap.innerHTML = `
      <img src="${product.image}" alt="${product.name}" style="width:100%;border-radius:12px;aspect-ratio:16/9;object-fit:cover" />
      <h2 style="margin-top:0.8rem">${product.name}</h2>
      <p style="color:#6d6288">${product.description}</p>
      <p><strong>Category:</strong> ${product.category}</p>
      <p><strong>Stock:</strong> ${product.stock}</p>
      <h3>${formatPrice(product.price)}</h3>
      <div class="row" style="margin-top:0.8rem">
        <button class="btn btn-primary" id="addBtn">Add to Cart</button>
        <a class="btn btn-ghost" href="/cart.html">Go to Cart</a>
      </div>
    `;

    document.getElementById("addBtn").addEventListener("click", () => {
      addToCart(product, 1);
    });
  } catch (error) {
    detailWrap.innerHTML = `<p class="empty">${error.message}</p>`;
  }
}

loadProduct();
