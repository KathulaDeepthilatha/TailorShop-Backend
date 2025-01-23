const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true  // Remove whitespace
  },
  mobile: { 
    type: String, 
    required: [true, "Mobile number is required"],
    trim: true,
    match: [/^[0-9]{10}$/, "Mobile number must be 10 digits"]
  },
  measurements: {
    neck: { type: Number, default: 0, min: [0, 'Measurement cannot be negative'], max: [100, 'Invalid measurement'] },
    full_shoulder: { type: Number, default: 0, min: [0, 'Measurement cannot be negative'], max: [100, 'Invalid measurement'] },
    full_sleeves: { type: Number, default: 0, min: [0, 'Measurement cannot be negative'], max: [100, 'Invalid measurement'] },
    bicep: { type: Number, default: 0, min: [0, 'Measurement cannot be negative'], max: [100, 'Invalid measurement'] },
    full_chest: { type: Number, default: 0, min: [0, 'Measurement cannot be negative'], max: [200, 'Invalid measurement'] },
    waist: { type: Number, default: 0, min: [0, 'Measurement cannot be negative'], max: [200, 'Invalid measurement'] },
    jacket: { type: Number, default: 0, min: [0, 'Measurement cannot be negative'], max: [100, 'Invalid measurement'] },
    hips: { type: Number, default: 0, min: [0, 'Measurement cannot be negative'], max: [200, 'Invalid measurement'] },
    thigh: { type: Number, default: 0, min: [0, 'Measurement cannot be negative'], max: [100, 'Invalid measurement'] },
    trouser_waist: { type: Number, default: 0, min: [0, 'Measurement cannot be negative'], max: [200, 'Invalid measurement'] },
    trouser_hips: { type: Number, default: 0, min: [0, 'Measurement cannot be negative'], max: [200, 'Invalid measurement'] },
    trouser_length: { type: Number, default: 0, min: [0, 'Measurement cannot be negative'], max: [150, 'Invalid measurement'] },
    ankle: { type: Number, default: 0, min: [0, 'Measurement cannot be negative'], max: [50, 'Invalid measurement'] },
    full_crotch: { type: Number, default: 0, min: [0, 'Measurement cannot be negative'], max: [100, 'Invalid measurement'] },
  },
}, { 
  timestamps: true,
  validateBeforeSave: true
 });  

// Add a pre-save hook to ensure measurements are numbers
CustomerSchema.pre('save', function(next) {
  const measurements = this.measurements;
  for (let key in measurements) {
    if (measurements[key] !== undefined) {
      measurements[key] = Number(measurements[key]);
    }
  }
  next();
});

module.exports = mongoose.model("Customer", CustomerSchema);
