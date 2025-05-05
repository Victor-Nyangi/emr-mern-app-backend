import mongoose, { Schema } from "mongoose";

const diagnosisSchema = new mongoose.Schema(
  {
    visit_id: {
      type: Schema.Types.ObjectId,
      ref: "Visit",
      required: true,
      index: true,
    },
    diagnosis: {
      type: String,
      required: true, // e.g., "Hypertension"
    },
    code: {
      type: String,
      required: true, // e.g., "I10" (ICD-10 code)
    },
    type: {
      type: String,
      enum: ["Primary", "Secondary", "Differential", "Working"],
      default: "Primary",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Active", "Resolved", "Chronic", "Provisional"],
      default: "Active",
    },
    medicalProvider_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalProvider",
      required: true,
      index: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);
const Diagnosis = mongoose.model("Diagnosis", diagnosisSchema);
export default Diagnosis;
