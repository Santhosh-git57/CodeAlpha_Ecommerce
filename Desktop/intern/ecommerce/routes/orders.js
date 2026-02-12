const express = require("express");
const { auth } = require("../middleware/auth");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart items are required" });
    }

    if (!shippingAddress || shippingAddress.trim().length < 5) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    const normalizedItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

      if (quantity > product.stock) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`
        });
      }

      product.stock -= quantity;
      await product.save();

      normalizedItems.push({
        product: product._id,
        name: product.name,
        quantity,
        price: product.price
      });

      totalAmount += product.price * quantity;
    }

    const order = await Order.create({
      user: req.user.id,
      items: normalizedItems,
      totalAmount,
      shippingAddress: shippingAddress.trim()
    });

    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] }, { upsert: true });

    return res.status(201).json({
      message: "Order placed successfully",
      order
    });
  } catch (error) {
    return res.status(500).json({ message: "Order processing failed" });
  }
});

router.get("/my", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
});

module.exports = router;
