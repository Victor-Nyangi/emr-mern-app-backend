import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
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
    status: {
      type: String,
      required: true,
      enum: ["Scheduled", "Completed", "Cancelled"],
    },
    type: {
      type: String,
      required: true,
      enum: ["Consultation", "Annual Physical", "Follow-up"],
    },
    time: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // simple HH:MM validation
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
