import Role from "../models/Role";

export const defaultRoles = [
  {
    name: "admin",
    display_name: "System Administrator",
    description: "Full system access with all permissions",
    permissions: [
      {
        resource: "patient",
        actions: ["read", "write", "delete", "create"],
        attributes: {
          department: ["emergency", "cardiology", "pediatrics", "orthopedics", "neurology", "general", "billing", "laboratory"],
          patient_status: ["active", "inactive", "discharged", "admitted", "emergency"],
          visit_type: ["consultation", "emergency", "follow_up", "surgery", "lab_test"],
          data_sensitivity: ["public", "confidential", "restricted", "emergency_only"]
        },
        conditions: {
          own_patients_only: false,
          own_department_only: false,
          emergency_access: true
        }
      },
      {
        resource: "visit",
        actions: ["read", "write", "delete", "create"],
        attributes: {
          department: ["emergency", "cardiology", "pediatrics", "orthopedics", "neurology", "general", "billing", "laboratory"],
          patient_status: ["active", "inactive", "discharged", "admitted", "emergency"],
          visit_type: ["consultation", "emergency", "follow_up", "surgery", "lab_test"],
          data_sensitivity: ["public", "confidential", "restricted", "emergency_only"]
        },
        conditions: {
          own_patients_only: false,
          own_department_only: false,
          emergency_access: true
        }
      },
      {
        resource: "appointment",
        actions: ["read", "write", "delete", "create"],
        attributes: {
          department: ["emergency", "cardiology", "pediatrics", "orthopedics", "neurology", "general", "billing", "laboratory"],
          patient_status: ["active", "inactive", "discharged", "admitted", "emergency"],
          visit_type: ["consultation", "emergency", "follow_up", "surgery", "lab_test"],
          data_sensitivity: ["public", "confidential", "restricted", "emergency_only"]
        },
        conditions: {
          own_patients_only: false,
          own_department_only: false,
          emergency_access: true
        }
      },
      {
        resource: "medical_provider",
        actions: ["read", "write", "delete", "create"],
        attributes: {
          department: ["emergency", "cardiology", "pediatrics", "orthopedics", "neurology", "general", "billing", "laboratory"],
          data_sensitivity: ["public", "confidential", "restricted"]
        },
        conditions: {
          own_patients_only: false,
          own_department_only: false,
          emergency_access: true
        }
      },
      {
        resource: "billing",
        actions: ["read", "write", "delete", "create"],
        attributes: {
          department: ["emergency", "cardiology", "pediatrics", "orthopedics", "neurology", "general", "billing", "laboratory"],
          data_sensitivity: ["public", "confidential", "restricted"]
        },
        conditions: {
          own_patients_only: false,
          own_department_only: false,
          emergency_access: true
        }
      },
      {
        resource: "clinical_notes",
        actions: ["read", "write", "delete", "create"],
        attributes: {
          department: ["emergency", "cardiology", "pediatrics", "orthopedics", "neurology", "general", "billing", "laboratory"],
          data_sensitivity: ["public", "confidential", "restricted", "emergency_only"]
        },
        conditions: {
          own_patients_only: false,
          own_department_only: false,
          emergency_access: true
        }
      }
    ]
  },
  {
    name: "doctor",
    display_name: "Medical Doctor",
    description: "Full patient care access with department restrictions",
    permissions: [
      {
        resource: "patient",
        actions: ["read", "write", "create"],
        attributes: {
          department: ["emergency", "cardiology", "pediatrics", "orthopedics", "neurology", "general"],
          patient_status: ["active", "inactive", "discharged", "admitted", "emergency"],
          visit_type: ["consultation", "emergency", "follow_up", "surgery"],
          data_sensitivity: ["public", "confidential", "restricted", "emergency_only"]
        },
        conditions: {
          own_patients_only: false,
          own_department_only: true,
          emergency_access: true
        }
      },
      {
        resource: "visit",
        actions: ["read", "write", "create"],
        attributes: {
          department: ["emergency", "cardiology", "pediatrics", "orthopedics", "neurology", "general"],
          patient_status: ["active", "inactive", "discharged", "admitted", "emergency"],
          visit_type: ["consultation", "emergency", "follow_up", "surgery"],
          data_sensitivity: ["public", "confidential", "restricted", "emergency_only"]
        },
        conditions: {
          own_patients_only: false,
          own_department_only: true,
          emergency_access: true
        }
      },
      {
        resource: "appointment",
        actions: ["read", "write", "create"],
        attributes: {
          department: ["emergency", "cardiology", "pediatrics", "orthopedics", "neurology", "general"],
          patient_status: ["active", "inactive", "discharged", "admitted", "emergency"],
          visit_type: ["consultation", "emergency", "follow_up", "surgery"],
          data_sensitivity: ["public", "confidential", "restricted"]
        },
        conditions: {
          own_patients_only: false,
          own_department_only: true,
          emergency_access: true
        }
      },
      {
        resource: "medical_provider",
        actions: ["read"],
        attributes: {
          department: ["emergency", "cardiology", "pediatrics", "orthopedics", "neurology", "general"],
          data_sensitivity: ["public", "confidential"]
        },
        conditions: {
          own_patients_only: false,
          own_department_only: true,
          emergency_access: false
        }
      },
      {
        resource: "clinical_notes",
        actions: ["read", "write", "create"],
        attributes: {
          department: ["emergency", "cardiology", "pediatrics", "orthopedics", "neurology", "general"],
          data_sensitivity: ["public", "confidential", "restricted", "emergency_only"]
        },
        conditions: {
          own_patients_only: false,
          own_department_only: true,
          emergency_access: true
        }
      }
    ]
  },
  {
    name: "nurse",
    display_name: "Registered Nurse",
    description: "Patient care access with department and time restrictions",
    permissions: [
      {
        resource: "patient",
        actions: ["read", "write", "create"],
        attributes: {
          department: ["emergency", "cardiology", "pediatrics", "orthopedics", "neurology", "general"],
          patient_status: ["active", "inactive", "admitted", "emergency"],
          visit_type: ["consultation", "emergency", "follow_up"],
          data_sensitivity: ["public", "confidential", "emergency_only"]
        },
        conditions: {
          own_patients_only: false,
          own_department_only: true,
          emergency_access: true
        }
      },
      {
        resource: "visit",
        actions: ["read", "write", "create"],
        attributes: {
          department: ["emergency", "cardiology", "pediatrics", "orthopedics", "neurology", "general"],
          patient_status: ["active", "inactive", "admitted", "emergency"],
          visit_type: ["consultation", "emergency", "follow_up"],
          data_sensitivity: ["public", "confidential", "emergency_only"]
        },
        conditions: {
          own_patients_only: false,
          own_department_only: true,
          emergency_access: true
        }
      },
      {
        resource: "appointment",
        actions: ["read"],
        attributes: {
          department: ["emergency", "cardiology", "pediatrics", "orthopedics", "neurology", "general"],
          data_sensitivity: ["public", "confidential"]
        },
        conditions: {
          own_patients_only: false,
          own_department_only: true,
          emergency_access: false
        }
      },
      {
        resource: "clinical_notes",
        actions: ["read", "write"],
        attributes: {
          department: ["emergency", "cardiology", "pediatrics", "orthopedics", "neurology", "general"],
          data_sensitivity: ["public", "confidential", "emergency_only"]
        },
        conditions: {
          own_patients_only: false,
          own_department_only: true,
          emergency_access: true
        }
      }
    ]
  },
  {
    name: "receptionist",
    display_name: "Receptionist",
    description: "Limited access for patient registration and appointment management",
    permissions: [
      {
        resource: "patient",
        actions: ["read", "create"],
        attributes: {
          department: ["emergency", "cardiology", "pediatrics", "orthopedics", "neurology", "general"],
          patient_status: ["active", "inactive"],
          visit_type: ["consultation", "follow_up"],
          data_sensitivity: ["public"]
        },
        conditions: {
          own_patients_only: false,
          own_department_only: false,
          emergency_access: false
        }
      },
      {
        resource: "appointment",
        actions: ["read", "write", "create"],
        attributes: {
          department: ["emergency", "cardiology", "pediatrics", "orthopedics", "neurology", "general"],
          patient_status: ["active", "inactive"],
          visit_type: ["consultation", "follow_up"],
          data_sensitivity: ["public"]
        },
        conditions: {
          own_patients_only: false,
          own_department_only: false,
          emergency_access: false
        }
      },
      {
        resource: "visit",
        actions: ["read"],
        attributes: {
          department: ["emergency", "cardiology", "pediatrics", "orthopedics", "neurology", "general"],
          patient_status: ["active", "inactive"],
          visit_type: ["consultation", "follow_up"],
          data_sensitivity: ["public"]
        },
        conditions: {
          own_patients_only: false,
          own_department_only: false,
          emergency_access: false
        }
      }
    ]
  },
  {
    name: "billing_specialist",
    display_name: "Billing Specialist",
    description: "Access to billing and financial information",
    permissions: [
      {
        resource: "patient",
        actions: ["read"],
        attributes: {
          department: ["emergency", "cardiology", "pediatrics", "orthopedics", "neurology", "general", "billing"],
          patient_status: ["active", "inactive", "discharged"],
          data_sensitivity: ["public", "confidential"]
        },
        conditions: {
          own_patients_only: false,
          own_department_only: false,
          emergency_access: false
        }
      },
      {
        resource: "billing",
        actions: ["read", "write", "create"],
        attributes: {
          department: ["emergency", "cardiology", "pediatrics", "orthopedics", "neurology", "general", "billing"],
          data_sensitivity: ["public", "confidential"]
        },
        conditions: {
          own_patients_only: false,
          own_department_only: false,
          emergency_access: false
        }
      },
      {
        resource: "visit",
        actions: ["read"],
        attributes: {
          department: ["emergency", "cardiology", "pediatrics", "orthopedics", "neurology", "general", "billing"],
          patient_status: ["active", "inactive", "discharged"],
          data_sensitivity: ["public", "confidential"]
        },
        conditions: {
          own_patients_only: false,
          own_department_only: false,
          emergency_access: false
        }
      }
    ]
  },
  {
    name: "lab_technician",
    display_name: "Laboratory Technician",
    description: "Access to laboratory tests and results",
    permissions: [
      {
        resource: "patient",
        actions: ["read"],
        attributes: {
          department: ["laboratory"],
          patient_status: ["active", "inactive", "admitted"],
          visit_type: ["lab_test"],
          data_sensitivity: ["public", "confidential"]
        },
        conditions: {
          own_patients_only: false,
          own_department_only: true,
          emergency_access: false
        }
      },
      {
        resource: "visit",
        actions: ["read", "write"],
        attributes: {
          department: ["laboratory"],
          patient_status: ["active", "inactive", "admitted"],
          visit_type: ["lab_test"],
          data_sensitivity: ["public", "confidential"]
        },
        conditions: {
          own_patients_only: false,
          own_department_only: true,
          emergency_access: false
        }
      },
      {
        resource: "clinical_notes",
        actions: ["read", "write"],
        attributes: {
          department: ["laboratory"],
          data_sensitivity: ["public", "confidential"]
        },
        conditions: {
          own_patients_only: false,
          own_department_only: true,
          emergency_access: false
        }
      }
    ]
  }
];

export const seedRoles = async () => {
  try {
    console.log('Seeding roles and permissions...');
    
    for (const roleData of defaultRoles) {
      const existingRole = await Role.findOne({ name: roleData.name });
      
      if (existingRole) {
        console.log(`Role ${roleData.name} already exists, updating...`);
        await Role.findOneAndUpdate(
          { name: roleData.name },
          roleData,
          { new: true, upsert: true }
        );
      } else {
        console.log(`Creating role ${roleData.name}...`);
        await Role.create(roleData);
      }
    }
    
    console.log('Roles and permissions seeded successfully!');
  } catch (error) {
    console.error('Error seeding roles:', error);
    throw error;
  }
}; 