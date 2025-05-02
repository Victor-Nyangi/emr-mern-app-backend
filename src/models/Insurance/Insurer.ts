import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    website: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  { _id: false }
);

const agentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  { _id: false }
);

const insurerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      defaultValue: "Active",
    },
    panel: {
      type: String,
      required: true,
      enum: ["Tier I", "Tier II", "Tier III", "Tier IV"],
    },
    payerId: {
      type: String, // Optional: for electronic billing/EDI
    },
    contact: contactSchema,
    agent: agentSchema,
  },
  {
    timestamps: true,
  }
);

const Insurer = mongoose.model("Insurer", insurerSchema);
export default Insurer;
