const mongoose = require("mongoose");
const { Schema } = mongoose;

const medicationSchema = new Schema(
  {
    medication: {
      type: String,
      required: true,
      trim: true,
    },
    dosage: {
      type: String,
      required: true,
      trim: true,
    },
    frequency: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Completed", "Discontinued", "Pending"],
      default: "Active",
      trim: true,
    },
    duration: {
      type: String, // Or Number, depending on how you want to store it (e.g., "7 days", "2 weeks", 30)
      trim: true,
    },
    prescribedBy: {
      type: Schema.Types.ObjectId,
      ref: "MedicalProvider",
      required: true,
      index: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },
    visitId: {
      type: Schema.Types.ObjectId,
      ref: "Visit",
      required: true,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Medication = mongoose.model("Medication", medicationSchema);

export default Medication;
