import mongoose from "mongoose";

/** A patient's invoice details */
const invoiceSchema = new mongoose.Schema({
  visit_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Visit",
    required: true,
  },
  services_charged: {
    type: [String],
    required: false,
  },
  description: {
    type: [String],
    required: false,
  },
  payment_mode: {
    type: [String],
    enum: ["COPAY", "INSURANCE", "SELF"],
    default: "SELF",
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["PAID", "UNPAID", "PENDING INSURANCE REVIEW"],
    default: "UNPAID",
  },
  updated_date: {
    type: Date,
    default: Date.now,
  },
  notes: String,
});

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
