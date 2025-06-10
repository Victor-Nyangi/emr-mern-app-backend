const mongoose = require("mongoose");

// Set up schedules instead of serviceStartTime and serviceEndTime

const QueueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    priority: {
      type: String,
      enum: ["EMERGENCY", "HIGH", "NORMAL", "LOW"],
      default: "NORMAL",
    },
    status: {
      type: String,
      enum: ["WAITING", "CALLED", "IN SERVICE", "COMPLETED", "CANCELLED"],
      default: "WAITING",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalProvider",
      default: null,
    },
    serviceStartTime: Date,
    serviceEndTime: Date,
    notes: String,
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Queue = mongoose.model("Queue", QueueSchema);
export default Queue;
