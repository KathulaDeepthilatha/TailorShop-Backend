// const mongoose = require("mongoose");

// const customerSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   phone: { type: String, required: true },
//   gender: { type: String, enum: ["men", "women"], required: true },
//   measurements: {
//     shoulder: { type: Number },
//     chest: { type: Number },
//     waist: { type: Number },
//   },
// });

// module.exports = mongoose.model("Customer", customerSchema);


const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, required: true },
  measurements: {
    shoulder: { type: String, default: "" },
    chest: { type: String, default: "" },
    waist: { type: String, default: "" },
  },
});

module.exports = mongoose.model("Customer", CustomerSchema);
