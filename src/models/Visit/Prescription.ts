const mongoose = require("mongoose");
const { Schema } = mongoose;

const prescriptionSchema = new Schema(
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
      ref: "MedicalProvider", //  Reference to the MedicalProvider model
      required: true,
      index: true,
    },
    patientId: {
      // Add patientId for easier querying
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },
    visitId: {
      //add visit id
      type: Schema.Types.ObjectId,
      ref: "Visit",
      index: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);

export default Prescription;
