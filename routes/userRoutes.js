const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Generate a 6-digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Manually add a user (for initial setup, remove in production)
router.post("/add-user", async (req, res) => {
  const { phone, pin } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this phone number already exists" });
    }

    const newUser = new User({ phone, pin });
    await newUser.save();
    res.status(201).json({ message: "User added successfully", newUser });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({
      message: "Error adding user",
      error: error.message,
    });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { phone, pin } = req.body;
  try {
    const user = await User.findOne({ phone });
    console.log("User found:", user);
    if (user && user.pin === pin) {
      console.log("Login successful");
      res.status(200).json({ message: "Login successful" });
    } else {
      console.log("Invalid phone number or PIN");
      res.status(401).json({ message: "Invalid phone number or PIN" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
});

// Send OTP for PIN change
router.post("/send-otp", async (req, res) => {
  const { phone } = req.body;
  const otp = generateOtp();
  try {
    const user = await User.findOneAndUpdate({ phone }, { otp }, { new: true });
    if (user) {
      // Implement SMS sending logic here using an SMS gateway
      res.status(200).json({ message: "OTP sent successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
});

// Verify OTP and change PIN
router.post("/change-pin", async (req, res) => {
  const { phone, otp, newPin } = req.body;
  try {
    const user = await User.findOne({ phone, otp });
    if (user) {
      user.pin = newPin;
      user.otp = null; // Clear OTP after successful change
      await user.save();
      res.status(200).json({ message: "PIN changed successfully" });
    } else {
      res.status(400).json({ message: "Invalid OTP or phone number" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error changing PIN", error });
  }
});

module.exports = router;
