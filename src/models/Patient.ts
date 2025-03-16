import mongoose from "mongoose"

const patientSchema = new mongoose.Schema({
    first_name : {
        type: String,
        required: true
    },
    last_name : {
        type: String,
        required: true
    },
    date_of_birth : {
        type: Date,
        required: true
    },
    address: {
        type: String,
        requried: true
    },
    phone_number : {
        type: Number,
        requried: true
    },
    email : {
        type: String,
        requried: true
    },
    gender: {
        type: String,
        required: true
    },
    blood_group: {
        type: String,
        required: true
    },
    salutation: {
        type: String,
        required: true
    },
    marital_status: {
        type: String,
        required: true
    },
    education_level: {
        type: String,
        required: true
    },
    income_level: {
        type: String,
        required: true
    },
    occupation: {
        type: String,
        required: true
    },
    size_of_family: {
        type: Number,
        required: true
    },
    emergency_contact: {
        type: String,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    underlying_conditions: {
        type: [String],
        required: true
    },
    is_active : {
        type: Boolean,
        default: false
    },
    updated_date: {
        type: Date,
        default: Date.now
      }
    });

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;