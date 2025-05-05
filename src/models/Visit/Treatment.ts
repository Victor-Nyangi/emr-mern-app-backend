import mongoose, { Schema } from "mongoose";

const treatmentSchema = new mongoose.Schema(
  {
    visit_id: {
      type: Schema.Types.ObjectId,
      ref: "Visit",
      required: true,
      index: true,
    },
    procedure: {
      type: String,
      required: true, // e.g., "Wound Debridement"
    },
    date: {
      type: Date,
      required: true,
    },
    medicalProvider_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalProvider",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["Planned", "Ongoing", "Completed", "Cancelled"],
      default: "Planned",
    },
    notes: {
      type: String,
    },
    isRecommended: {
      type: Boolean,
      default: false,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0, // Represented as a percentage
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
  },
  {
    timestamps: true,
  }
);

const Treatment = mongoose.model("Treatment", treatmentSchema);
export default Treatment;
