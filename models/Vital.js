const mongoose = require("mongoose");

const vitalSchema = new mongoose.Schema({
  patient_name: {
    type: String,
    required: true,
  },
  body_temperature: {
    type: Number,
    required: true,
  },
  pulse_rate: {
    type: String,
    required: true,
  },
  respiration_rate: {
    type: String,
    required: true,
  },
  blood_pressure: {
    type: String,
    required: true,
  },
  overall_status: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  blood_glucose: {
    type: String,
    required: true,
  },
  health_status: {
    type: String,
    required: true,
  },
  updated_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Vital = mongoose.model("Vital", vitalSchema);
