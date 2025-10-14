// scripts/fixAdmins.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js"; // Adjust path if necessary

dotenv.config();

async function fixAdmins() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // === ADMIN ACCOUNT ===
    const adminEmail = "admin@clearproaligner.com";
    const adminPassword = "ClearPro@2025";
    const adminHashed = await bcrypt.hash(adminPassword, 10);

    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      admin.password = adminHashed;
      admin.role = "admin";
      admin.verified = true;
      await admin.save();
      console.log(`🔄 Updated existing admin: ${adminEmail}`);
    } else {
      await User.create({
        name: "Admin User",
        email: adminEmail,
        password: adminHashed,
        role: "admin",
        verified: true,
      });
      console.log(`🆕 Created new admin: ${adminEmail}`);
    }

    // === DOCTOR ACCOUNT ===
    const doctorEmail = "doctor@clearproaligner.com";
    const doctorPassword = "clearpro@2025";
    const doctorHashed = await bcrypt.hash(doctorPassword, 10);

    let doctor = await User.findOne({ email: doctorEmail });

    if (doctor) {
      doctor.password = doctorHashed;
      doctor.role = "doctor";
      doctor.verified = true;
      await doctor.save();
      console.log(`🔄 Updated existing doctor: ${doctorEmail}`);
    } else {
      await User.create({
        name: "Doctor Admin",
        email: doctorEmail,
        password: doctorHashed,
        role: "doctor",
        verified: true,
      });
      console.log(`🆕 Created new doctor: ${doctorEmail}`);
    }

    console.log("\n✅ DONE!");
    console.log("You can now log in with:");
    console.log(`🩺 Doctor → ${doctorEmail} | ${doctorPassword}`);
    console.log(`🧑‍⚕️ Admin  → ${adminEmail}  | ${adminPassword}`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error fixing accounts:", err);
    process.exit(1);
  }
}

fixAdmins();
