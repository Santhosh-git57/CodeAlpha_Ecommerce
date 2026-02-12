const express = require("express");
const { auth, adminOnly } = require("../middleware/auth");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

const router = express.Router();

router.use(auth, adminOnly);

router.get("/users", async (_req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.get("/orders", async (_req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
});

router.patch("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["Placed", "Processing", "Shipped", "Delivered"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user", "name email role");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json({ message: "Order status updated", order });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update order status" });
  }
});

router.get("/products", async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch products" });
  }
});

router.post("/products", async (req, res) => {
  try {
    const { name, description, category, price, image, stock } = req.body;
    if (!name || !description || !category || !image) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const product = await Product.create({
      name,
      description,
      category,
      image,
      price: Number(price),
      stock: Number(stock)
    });

    return res.status(201).json({ message: "Product created", product });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create product" });
  }
});

router.put("/products/:id", async (req, res) => {
  try {
    const updates = {
      ...req.body
    };

    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);

    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ message: "Product updated", product });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update product" });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({ message: "Product deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete product" });
  }
});

router.get("/carts", async (_req, res) => {
  try {
    const carts = await Cart.find({ "items.0": { $exists: true } })
      .populate("user", "name email role")
      .populate("items.product", "name price")
      .sort({ updatedAt: -1 });

    return res.json(carts);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch carts" });
  }
});

module.exports = router;
