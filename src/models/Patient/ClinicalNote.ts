import mongoose from "mongoose";

const clinicalNoteSchema = new mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },
    medicalProvider_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalProvider",
      required: true,
      index: true,
    },
    assessment: {
      type: [
        {
          condition: { type: String, required: true, trim: true },
          status: { type: String, trim: true }, // e.g., improved, stable, new
        },
      ],
      default: [],
    },
    plan: {
      type: [
        {
          intervention: { type: String, required: true, trim: true },
          details: { type: String, trim: true },
        },
      ],
      default: [],
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const ClinicalNote = mongoose.model("ClinicalNote", clinicalNoteSchema);
export default ClinicalNote;
