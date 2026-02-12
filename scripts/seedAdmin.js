const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

dotenv.config();

async function seedAdmin() {
  try {
    await connectDB();

    const email = "admin@yashcart.com";
    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate(
      { email },
      {
        name: "Yash Admin",
        email,
        password: hashedPassword,
        role: "admin"
      },
      { upsert: true, new: true }
    );

    console.log("Admin seeded: admin@yashcart.com / admin123");
    await mongoose.connection.close();
  } catch (error) {
    console.error("Admin seed failed:", error.message);
    process.exit(1);
  }
}

seedAdmin();
