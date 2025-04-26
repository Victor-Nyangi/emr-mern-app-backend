import mongoose from "mongoose";

const drugSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  manufacter_date: {
    type: Date,
    required: true,
  },
  expiry_date: {
    type: Date,
    required: true,
  },
  updated_date: {
    type: Date,
    default: Date.now,
  },
});

const Drug = mongoose.model("Drug", drugSchema);
export default Drug;
