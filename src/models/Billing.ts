import mongoose from "mongoose";

/** A patient's billing details */
const billingSchema = new mongoose.Schema({
  patient_name: {
    type: String,
    required: true,
  },
  visit_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Visit",
    required: true,
  },
  amountPaid: {
    type: Number,
    default: 0,
  },
  insuranceProvider: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Insurer",
  },
  services_charged: {
    type: [String],
    required: false,
  },
  diagnosis: {
    type: String,
    required: false,
  },
  amount: {
    type: Number,
    required: true,
  },
  updated_date: {
    type: Date,
    default: Date.now,
  },
  notes: String,
});

const Billing = mongoose.model("Billing", billingSchema);
export default Billing;
