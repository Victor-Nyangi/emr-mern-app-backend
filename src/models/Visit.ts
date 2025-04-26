import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    queueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Queue",
      required: true,
    },
    payment_method: {
      type: String,
      enum: ["Cash", "Insurance", "Card", "MobileMoney", "Free"],
      required: true,
    },
    isFollowUp: {
      Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "ARRIVED",
    },
    visitDate: {
      type: Date,
      default: Date.now,
    },
    notes: String,
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Visit = mongoose.model("Visit", visitSchema);
export default Visit;
