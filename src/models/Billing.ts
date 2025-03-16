import mongoose from "mongoose"

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

const Billing = mongoose.model("Billing", billingSchema);
export default Billing;