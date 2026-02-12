const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Product = require("../models/Product");

dotenv.config();

const sampleProducts = [
  {
    name: "Urban Knit Polo",
    description: "Breathable knit polo for all-day comfort with a refined fit.",
    category: "Men",
    price: 1599,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    stock: 20
  },
  {
    name: "Minimal Shift Dress",
    description: "Elegant silhouette with soft fabric and subtle movement.",
    category: "Women",
    price: 1899,
    image: "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=900&q=80",
    stock: 18
  },
  {
    name: "Motion Runner",
    description: "Cushioned lightweight sneakers made for city and travel.",
    category: "Shoes",
    price: 2499,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    stock: 12
  },
  {
    name: "Smart Carry Tote",
    description: "Structured tote with secure zip and utility compartments.",
    category: "Accessories",
    price: 1199,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
    stock: 25
  },
  {
    name: "Classic Denim Jacket",
    description: "Layer-ready denim jacket with soft inner lining and durable stitching.",
    category: "Men",
    price: 2199,
    image: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&w=900&q=80",
    stock: 14
  },
  {
    name: "Flowy Summer Top",
    description: "Lightweight top with breathable fabric for daily comfort.",
    category: "Women",
    price: 1299,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
    stock: 22
  },
  {
    name: "Trail Trek Boots",
    description: "High-grip outdoor boots with ankle support and weather resistance.",
    category: "Shoes",
    price: 3299,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80",
    stock: 10
  },
  {
    name: "Aero Sling Bag",
    description: "Compact sling bag with premium zips and quick-access front pocket.",
    category: "Accessories",
    price: 999,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
    stock: 30
  },
  {
    name: "Linen Weekend Shirt",
    description: "Relaxed fit linen shirt designed for casual outings and travel.",
    category: "Men",
    price: 1499,
    image: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?auto=format&fit=crop&w=900&q=80",
    stock: 19
  },
  {
    name: "Urban Midi Dress",
    description: "Comfort-fit midi dress with modern cuts and soft finish.",
    category: "Women",
    price: 2399,
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=80",
    stock: 11
  },
  {
    name: "Sprint Flex Sneakers",
    description: "Daily wear sneakers built for comfort with cushioned sole support.",
    category: "Shoes",
    price: 2799,
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=80",
    stock: 16
  },
  {
    name: "Titan Steel Watch",
    description: "Stainless steel watch with clean dial and premium clasp design.",
    category: "Accessories",
    price: 3599,
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80",
    stock: 9
  }
];

async function seed() {
  try {
    await connectDB();
    await Product.deleteMany();
    await Product.insertMany(sampleProducts);
    console.log("Products seeded successfully");
    await mongoose.connection.close();
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
}

seed();
