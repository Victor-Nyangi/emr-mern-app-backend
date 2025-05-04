import mongoose from "mongoose";

const vitalSchema = new mongoose.Schema(
  {
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    visit_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visit",
      required: true,
    },
    body_temperature: {
      type: String,
      required: true,
    },
    pulse_rate: {
      type: String,
      required: true,
    },
    respiration_rate: {
      type: String,
      required: true,
    },
    blood_pressure: {
      type: String,
      required: true,
    },
    overall_status: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    blood_glucose: {
      type: String,
    },
    health_status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Vital = mongoose.model("Vital", vitalSchema);
export default Vital;
