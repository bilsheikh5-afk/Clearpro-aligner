// scripts/updateAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js"; // <-- adjust path if your model is in another folder

dotenv.config();

async function updateAdmin() {
  try {
    // ✅ Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // ✏️ Change these values as needed
    const currentEmail = "admin@clearproaligner.com";
    const newEmail = "doctor@clearproaligner.com"; // optional
    const newPassword = "ClearPro@2025"; // your new password

    // ✅ Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // ✅ Update the user
    const updatedUser = await User.findOneAndUpdate(
      { email: currentEmail },
      {
        email: newEmail,
        password: hashedPassword,
      },
      { new: true }
    );

    if (!updatedUser) {
      console.log("⚠️ No user found with that email.");
    } else {
      console.log("✅ Admin credentials updated successfully!");
      console.log(`New login: ${updatedUser.email}`);
      console.log(`New password: ${newPassword}`);
    }

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error updating admin credentials:", err);
    process.exit(1);
  }
}

updateAdmin();
