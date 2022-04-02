const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema({
  patient_name: {
    type: String,
    required: true,
  },
  service_charged: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  updated_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Billing = mongoose.model("Billing", billingSchema);
