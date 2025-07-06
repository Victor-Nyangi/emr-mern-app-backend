import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  resource: {
    type: String,
    required: true,
    enum: ['patient', 'visit', 'appointment', 'medical_provider', 'billing', 'clinical_notes']
  },
  actions: [{
    type: String,
    enum: ['read', 'write', 'delete', 'create']
  }],
  attributes: {
    // Attribute-based conditions
    department: [String], // Which departments they can access
    patient_status: [String], // Which patient statuses they can access
    visit_type: [String], // Which visit types they can access
    time_restrictions: {
      start_time: String, // Format: "HH:MM"
      end_time: String,   // Format: "HH:MM"
    },
    data_sensitivity: [String], // Which sensitivity levels they can access
  },
  conditions: {
    // Additional conditions
    own_patients_only: {
      type: Boolean,
      default: false
    },
    own_department_only: {
      type: Boolean,
      default: false
    },
    emergency_access: {
      type: Boolean,
      default: false
    }
  }
});

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['admin', 'doctor', 'nurse', 'receptionist', 'billing_specialist', 'lab_technician']
  },
  display_name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  permissions: [permissionSchema],
  is_active: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update the updated_at field before saving
roleSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

const Role = mongoose.model("Role", roleSchema);
export default Role; 