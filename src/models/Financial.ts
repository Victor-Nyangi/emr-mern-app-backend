import mongoose from "mongoose"

/** A patient's payment details */
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

const Financial = mongoose.model("Financial", financialSchema);
export default Financial;