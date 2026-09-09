import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    payment_method: {
      type: String,
      enum: ["Cash", "Insurance", "Card", "MobileMoney", "Free"],
      required: true,
    },
    isFollowUp: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["ARRIVED", "COMPLETED", "IN PROGRESS", "CANCELLED", "STALE"],
      default: "ARRIVED",
    },
    visitDate: {
      type: Date,
      default: Date.now,
    },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    duration: { type: String },
    currentQueue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Queue",
      required: true,
    },
    transitions: [
      {
        // These hold Queue ids, not queue names -- the transition form
        // sends `currentQueue` and `visit.currentQueue._id`. Kept as
        // String rather than ObjectId to avoid rewriting existing rows.
        queue: { type: String },
        prev_queue: { type: String },
        enteredAt: { type: Date, default: Date.now },
      },
    ],
    notes: String,
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  },
);

const Visit = mongoose.model("Visit", visitSchema);
export default Visit;
