import mongoose from "mongoose";

const clinicalNoteSchema = new mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    medicalProvider_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalProvider",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const ClinicalNote = mongoose.model("ClinicalNote", clinicalNoteSchema);
export default ClinicalNote;
