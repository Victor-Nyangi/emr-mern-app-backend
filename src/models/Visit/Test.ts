const mongoose = require("mongoose");
const { Schema } = mongoose;

const testSchema = new Schema(
  {
    testName: {
      type: String,
      required: true,
      trim: true, // Remove leading/trailing spaces
    },
    dateOrdered: {
      type: Date,
      default: Date.now, // Default to current date
    },
    status: {
      type: String,
      enum: ["Ordered", "Pending", "Completed", "Cancelled"], // Use an enum for controlled values
      default: "Ordered",
      trim: true,
    },
    result: {
      type: String,
      trim: true,
    },
    visit_id: {
      type: Schema.Types.ObjectId,
      ref: "Visit", // Reference the Visit model
      required: true,
      index: true, // Index this field for efficient querying
    },
    ordered_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalProvider",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
); // Add createdAt and updatedAt fields

const Test = mongoose.model("Test", testSchema);

export default Test;
