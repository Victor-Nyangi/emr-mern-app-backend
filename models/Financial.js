const mongoose = require("mongoose");

const financialSchema = new mongoose.Schema({
  patient_name: {
    type: String,
    required: true,
  },
  account_name: {
    type: String, 
    required: true,
  },
  account_number: {
    type: String,
    required: true,
  },
  account_type: {
    type: String,
    required: true,
  },
  updated_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Financial = mongoose.model("Financial", financialSchema);
