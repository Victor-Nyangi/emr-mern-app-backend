import mongoose from "mongoose";

/** Clinical Staff */
const medicalProviderSchema = new mongoose.Schema({
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
    required: true,
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
  salutation: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  is_active: {
    type: Boolean,
    default: false,
  },
  updated_date: {
    type: Date,
    default: Date.now,
  },
});

const MedicalProvider = mongoose.model(
  "MedicalProvider",
  medicalProviderSchema
);
export default MedicalProvider;
