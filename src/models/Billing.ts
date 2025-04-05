import mongoose from "mongoose"

/** A patient's invoice details */
const billingSchema = new mongoose.Schema({
  patient_name: {
    type: String,
    required: true,
  },
  visit_id: {
    type: String,
    required: true,
  },
  amountPaid: {
    type: Number,
    default: 0,
  },
  insuranceProvider: {
    type: String,
    default: null,
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
  notes: String,

});

const Billing = mongoose.model("Billing", billingSchema);
export default Billing;