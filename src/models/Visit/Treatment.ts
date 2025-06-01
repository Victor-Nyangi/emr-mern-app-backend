import mongoose, { Schema } from "mongoose";

const treatmentSchema = new mongoose.Schema(
  {
    visitId: {
      type: Schema.Types.ObjectId,
      ref: "Visit",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true, // e.g., "Wound Debridement"
    },
    type: {
      type: String,
      enum: ["Procedure", "Periodic", "Wholesome", "Other"],
      default: "Procedure",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
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
      enum: ["Scheduled", "Ongoing", "Completed", "Cancelled"],
      default: "Scheduled",
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
