const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  pin: { type: String, required: true },
  otp: { type: String } // Add field for OTP
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
