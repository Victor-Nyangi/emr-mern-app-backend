import mongoose from "mongoose";

const visitClinicalNoteSchema = new mongoose.Schema(
  {
    visit_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visit",
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
      type: [String],
      default: [],
    },
    plan: {
      type: [String],
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

const VisitClinicalNote = mongoose.model(
  "VisitClinicalNote",
  visitClinicalNoteSchema
);
export default VisitClinicalNote;
