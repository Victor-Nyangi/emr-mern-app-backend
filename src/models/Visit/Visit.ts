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
      default: "ARRIVED",
    },
    visitDate: {
      type: Date,
      default: Date.now,
    },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    duration: { type: String }, // or Number (minutes), but String is fine for display
    currentQueue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Queue",
      required: true,
    },
    transitions: [
      {
        queue: { type: String }, // e.g., "Consultation"
        prev_queue: { type: String }, // e.g., "Triage"
        enteredAt: { type: Date, default: Date.now },
      },
    ],
    notes: String,
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Visit = mongoose.model("Visit", visitSchema);
export default Visit;
