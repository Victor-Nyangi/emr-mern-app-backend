const mongoose = require('mongoose');

const QueueSchema = new mongoose.Schema({
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  ticketNumber: {
    type: String,
    required: true,
    unique: true,
  },
  priority: {
    type: String,
    enum: ['Emergency', 'High', 'Normal', 'Low'],
    default: 'Normal',
  },
  status: {
    type: String,
    enum: ['Waiting', 'Called', 'In Service', 'Completed', 'Cancelled'],
    default: 'Waiting',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  arrivalTime: {
    type: Date,
    default: Date.now,
  },
  calledTime: Date,
  serviceStartTime: Date,
  serviceEndTime: Date,
  notes: String,
}, {
  timestamps: true // adds createdAt and updatedAt
});

const Queue = mongoose.model('Queue', QueueSchema);
export default Queue;
