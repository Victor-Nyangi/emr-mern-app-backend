import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  date_of_birth: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    required: false,
  },
  phone_number: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  blood_group: {
    type: String,
    required: true,
  },
  salutation: {
    type: String,
    required: true,
  },
  emergency_contact: {
    type: String,
    required: true,
  },
  allergies: {
    type: [String],
    required: false,
  },
  underlying_conditions: {
    type: [String],
    required: false,
  },
  medications: [
    {
      name: {
        type: String,
        required: true,
      },
      dosage: {
        type: String,
        required: true,
      },
      frequency: {
        type: String,
        required: true,
      },
    },
  ],
  is_active: {
    type: Boolean,
    default: false,
  },
  updated_date: {
    type: Date,
    default: Date.now,
  },
});

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
