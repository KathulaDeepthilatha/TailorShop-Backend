
const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  measurements: {
    neck: { type: Number, default: 0 },
    full_shoulder: { type: Number, default: 0 },
    full_sleeves: { type: Number, default: 0 },
    bicep: { type: Number, default: 0 },
    full_chest: { type: Number, default: 0 },
    waist: { type: Number, default: 0 },
    jacket: { type: Number, default: 0 },
    hips: { type: Number, default: 0 },
    thigh: { type: Number, default: 0 },
    trouser_waist: { type: Number, default: 0 },
    trouser_hips: { type: Number, default: 0 },
    trouser_length: { type: Number, default: 0 },
    ankle: { type: Number, default: 0 },
    full_crotch: { type: Number, default: 0 },
  },
});

module.exports = mongoose.model("Customer", CustomerSchema);



