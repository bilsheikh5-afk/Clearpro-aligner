import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js"; // adjust path if needed

dotenv.config();

async function updateOrCreateAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const email = "doctor@clearproaligner.com";
    const password = "clearpro@2025";
    const hashed = await bcrypt.hash(password, 10);

    let user = await User.findOne({ email });

    if (user) {
      // ✅ Update existing user
      user.password = hashed;
      await user.save();
      console.log(`🔄 Updated password for ${email}`);
    } else {
      // ✅ Create new admin if not found
      user = await User.create({
        name: "Doctor Admin",
        email,
        password: hashed,
        role: "admin", // optional, depends on your schema
      });
      console.log(`🆕 Created new admin account: ${email}`);
    }

    console.log("✅ Admin credentials ready:");
    console.log("Email:", email);
    console.log("Password:", password);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error updating/creating admin:", err);
    process.exit(1);
  }
}

updateOrCreateAdmin();
