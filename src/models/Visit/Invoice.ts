import mongoose from "mongoose";

/** A patient's invoice details */
const invoiceSchema = new mongoose.Schema(
  {
    visitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visit",
      required: true,
    },
    service_charged: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    payment_mode: {
      type: String,
      enum: ["COPAY", "INSURANCE", "SELF"],
      default: "SELF",
    },
    amount: {
      type: Number,
      required: true,
    },
    copayAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["PAID", "UNPAID", "PENDING INSURANCE REVIEW"],
      default: "UNPAID",
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true, // Assuming policy numbers are unique
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
