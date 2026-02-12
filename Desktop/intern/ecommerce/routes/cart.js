const express = require("express");
const { auth } = require("../middleware/auth");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    return res.json(cart || { user: req.user.id, items: [] });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load cart" });
  }
});

router.put("/sync", auth, async (req, res) => {
  try {
    const inputItems = Array.isArray(req.body.items) ? req.body.items : [];
    const normalized = [];

    for (const item of inputItems) {
      const quantity = Number(item.quantity);
      if (!item.productId || !Number.isInteger(quantity) || quantity < 1) continue;

      const product = await Product.findById(item.productId).select("_id stock");
      if (!product) continue;

      normalized.push({
        product: product._id,
        quantity: Math.min(quantity, Math.max(product.stock, 1))
      });
    }

    const cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: normalized },
      { upsert: true, new: true }
    );

    return res.json({ message: "Cart synced", cart });
  } catch (error) {
    return res.status(500).json({ message: "Failed to sync cart" });
  }
});

router.delete("/clear", auth, async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] }, { upsert: true });
    return res.json({ message: "Cart cleared" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to clear cart" });
  }
});

module.exports = router;
