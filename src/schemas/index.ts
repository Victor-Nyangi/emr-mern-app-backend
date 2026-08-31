import Joi from "joi";

/**
 * Request schemas, mirroring the Mongoose models.
 *
 * Each resource gets a create schema (required fields enforced) and an
 * update schema derived from it with everything optional but at least one
 * key present -- a PATCH with an empty body is a caller mistake, not a
 * no-op success.
 */

const objectId = Joi.string().hex().length(24).messages({
  "string.hex": "{{#label}} must be a valid id",
  "string.length": "{{#label}} must be a valid id",
});

/** Turns a create schema into its PATCH counterpart. */
const toUpdate = (schema: Joi.ObjectSchema) =>
  schema
    .fork(Object.keys(schema.describe().keys), (field) => field.optional())
    .min(1);

// --- auth -------------------------------------------------------------

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().required(),
});

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(8).required().messages({
    "string.min": "password must be at least 8 characters",
  }),
  role: objectId.required(),
  department: Joi.string()
    .valid(
      "emergency",
      "cardiology",
      "pediatrics",
      "orthopedics",
      "neurology",
      "general",
      "billing",
      "laboratory",
    )
    .required(),
  employee_id: Joi.string().trim().min(1).required(),
});

// --- patient ----------------------------------------------------------

export const createPatientSchema = Joi.object({
  first_name: Joi.string().trim().min(1).required(),
  last_name: Joi.string().trim().min(1).required(),
  date_of_birth: Joi.date().max("now").required().messages({
    "date.max": "date_of_birth cannot be in the future",
  }),
  gender: Joi.string().trim().required(),
  blood_group: Joi.string().trim().required(),
  salutation: Joi.string().trim().required(),
  emergency_contact: Joi.string().trim().required(),
  // phone_number and email are required by the Patient model -- the
  // `requried` typo meant that was silently unenforced -- and the patient
  // form already requires both, so this matches what clients send.
  // address stays optional, as the model has it.
  address: Joi.string().trim().allow("", null),
  phone_number: Joi.alternatives()
    .try(Joi.string().trim().min(1), Joi.number())
    .required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  allergies: Joi.array().items(Joi.string()),
  underlying_conditions: Joi.array().items(Joi.string()),
  medications: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      dosage: Joi.string().required(),
      frequency: Joi.string().required(),
    }),
  ),
  is_active: Joi.boolean(),
});

export const updatePatientSchema = toUpdate(createPatientSchema);

// --- drug -------------------------------------------------------------

export const createDrugSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  description: Joi.string().trim().min(1).required(),
  manufacter_date: Joi.date().required(),
  expiry_date: Joi.date()
    .greater(Joi.ref("manufacter_date"))
    .required()
    .messages({
      "date.greater": "expiry_date must be after manufacter_date",
    }),
  updated_date: Joi.date(),
});

export const updateDrugSchema = toUpdate(
  Joi.object({
    name: Joi.string().trim().min(1),
    description: Joi.string().trim().min(1),
    manufacter_date: Joi.date(),
    expiry_date: Joi.date(),
    updated_date: Joi.date(),
  }),
);

// --- service ----------------------------------------------------------

export const createServiceSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  description: Joi.string().trim().min(1).required(),
  charge: Joi.number().min(0).required().messages({
    "number.min": "charge cannot be negative",
  }),
  main_purpose: Joi.string().trim().min(1).required(),
  updated_date: Joi.date(),
});

export const updateServiceSchema = toUpdate(createServiceSchema);

// --- department -------------------------------------------------------

export const createDepartmentSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  description: Joi.string().trim().min(1).required(),
  type: Joi.string().valid(
    "Triage",
    "Lab",
    "Radiology",
    "Pharmacy",
    "Consultation",
  ),
  updated_date: Joi.date(),
});

export const updateDepartmentSchema = toUpdate(createDepartmentSchema);

// --- visit ------------------------------------------------------------

export const createVisitSchema = Joi.object({
  patient_id: objectId.required(),
  payment_method: Joi.string()
    .valid("Cash", "Insurance", "Card", "MobileMoney", "Free")
    .required(),
  currentQueue: objectId.required(),
  isFollowUp: Joi.boolean(),
  notes: Joi.string().trim().allow("", null),
});

export const updateVisitSchema = toUpdate(
  Joi.object({
    patient_id: objectId,
    payment_method: Joi.string().valid(
      "Cash",
      "Insurance",
      "Card",
      "MobileMoney",
      "Free",
    ),
    currentQueue: objectId,
    isFollowUp: Joi.boolean(),
    status: Joi.string().valid(
      "ARRIVED",
      "COMPLETED",
      "IN PROGRESS",
      "CANCELLED",
      "STALE",
    ),
    notes: Joi.string().trim().allow("", null),
  }),
);

// The transition endpoint is the one place `status` is mandatory: the
// controller reads it unconditionally to advance the visit. `transition`
// is optional because the cancel/complete buttons send status alone.
//
// Both `queue` and `prev_queue` are ids, not names -- the Visit model's
// comments claim otherwise but components/visits/transition-visit.tsx
// sends `currentQueue` and `visit.currentQueue._id`.
export const transitionVisitSchema = Joi.object({
  status: Joi.string()
    .valid("ARRIVED", "COMPLETED", "IN PROGRESS", "CANCELLED", "STALE")
    .required(),
  transition: Joi.object({
    queue: objectId.required(),
    prev_queue: objectId.allow("", null),
    enteredAt: Joi.date(),
  }),
});

// --- appointment ------------------------------------------------------

export const createAppointmentSchema = Joi.object({
  patient_id: objectId.required(),
  medicalProvider_id: objectId.required(),
  status: Joi.string().valid("Scheduled", "Completed", "Cancelled").required(),
  type: Joi.string()
    .valid("Consultation", "Annual Physical", "Follow-up")
    .required(),
  // Mirrors the model's HH:MM match, but reported as a message rather
  // than a Mongoose CastError.
  time: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({ "string.pattern.base": "time must be in HH:MM format" }),
  date: Joi.date(),
});

export const updateAppointmentSchema = toUpdate(createAppointmentSchema);

// --- queue ------------------------------------------------------------

export const createQueueSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  departmentId: objectId.required(),
  priority: Joi.string().valid("EMERGENCY", "HIGH", "NORMAL", "LOW"),
  status: Joi.string().valid(
    "WAITING",
    "CALLED",
    "IN SERVICE",
    "COMPLETED",
    "CANCELLED",
  ),
  // The model defaults this to null, so an explicit null must survive.
  assignedTo: objectId.allow(null),
  serviceStartTime: Joi.date(),
  serviceEndTime: Joi.date(),
  notes: Joi.string().trim().allow("", null),
});

export const updateQueueSchema = toUpdate(createQueueSchema);

// --- vital ------------------------------------------------------------

// Every reading is a free-text string in the model (values arrive as
// "36.6", "120/80"), so these stay strings rather than numbers. Only
// weight is numeric.
export const createVitalSchema = Joi.object({
  patient_id: objectId.required(),
  visit_id: objectId.required(),
  body_temperature: Joi.string().trim().min(1).required(),
  pulse_rate: Joi.string().trim().min(1).required(),
  respiration_rate: Joi.string().trim().min(1).required(),
  blood_pressure: Joi.string().trim().min(1).required(),
  overall_status: Joi.string().trim().min(1).required(),
  weight: Joi.number().positive().required(),
  health_status: Joi.string().trim().min(1).required(),
  blood_glucose: Joi.string().trim().allow("", null),
});

export const updateVitalSchema = toUpdate(createVitalSchema);

// --- clinical note ----------------------------------------------------

export const createClinicalNoteSchema = Joi.object({
  patient_id: objectId.required(),
  medicalProvider_id: objectId.required(),
  content: Joi.string().trim().min(1).required(),
  assessment: Joi.array().items(
    Joi.object({
      condition: Joi.string().trim().min(1).required(),
      status: Joi.string().trim().allow("", null),
    }),
  ),
  plan: Joi.array().items(
    Joi.object({
      intervention: Joi.string().trim().min(1).required(),
      details: Joi.string().trim().allow("", null),
    }),
  ),
});

export const updateClinicalNoteSchema = toUpdate(createClinicalNoteSchema);

// Visit-scoped notes keep assessment/plan as flat string arrays.
export const createVisitClinicalNoteSchema = Joi.object({
  visit_id: objectId.required(),
  medicalProvider_id: objectId.required(),
  content: Joi.string().trim().min(1).required(),
  assessment: Joi.array().items(Joi.string().trim()),
  plan: Joi.array().items(Joi.string().trim()),
});

export const updateVisitClinicalNoteSchema = toUpdate(
  createVisitClinicalNoteSchema,
);

// --- billing ----------------------------------------------------------

export const createBillingSchema = Joi.object({
  patient_name: Joi.string().trim().min(1).required(),
  visit_id: objectId.required(),
  insuranceProvider: objectId.required(),
  amount: Joi.number().min(0).required().messages({
    "number.min": "amount cannot be negative",
  }),
  amountPaid: Joi.number().min(0).messages({
    "number.min": "amountPaid cannot be negative",
  }),
  services_charged: Joi.array().items(Joi.string().trim()),
  diagnosis: Joi.string().trim().allow("", null),
  notes: Joi.string().trim().allow("", null),
  updated_date: Joi.date(),
});

export const updateBillingSchema = toUpdate(createBillingSchema);

// --- financial --------------------------------------------------------

export const createFinancialSchema = Joi.object({
  patient_name: Joi.string().trim().min(1).required(),
  account_name: Joi.string().trim().min(1).required(),
  account_number: Joi.string().trim().min(1).required(),
  account_type: Joi.string().trim().min(1).required(),
  updated_date: Joi.date(),
});

export const updateFinancialSchema = toUpdate(createFinancialSchema);

// --- medical provider -------------------------------------------------

export const createMedicalProviderSchema = Joi.object({
  first_name: Joi.string().trim().min(1).required(),
  last_name: Joi.string().trim().min(1).required(),
  date_of_birth: Joi.date().max("now").required().messages({
    "date.max": "date_of_birth cannot be in the future",
  }),
  address: Joi.string().trim().min(1).required(),
  // The model types this as Number, so a formatted string would be
  // rejected downstream by Mongoose; accept either and let convert coerce.
  phone_number: Joi.alternatives()
    .try(Joi.number(), Joi.string().trim().pattern(/^\d+$/))
    .required()
    .messages({ "alternatives.match": "phone_number must be numeric" }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  gender: Joi.string().trim().min(1).required(),
  salutation: Joi.string().trim().min(1).required(),
  department: Joi.string().trim().min(1).required(),
  role: Joi.string().trim().min(1).required(),
  is_active: Joi.boolean(),
  updated_date: Joi.date(),
});

export const updateMedicalProviderSchema = toUpdate(
  createMedicalProviderSchema,
);

// --- diagnosis --------------------------------------------------------

export const createDiagnosisSchema = Joi.object({
  visit_id: objectId.required(),
  medicalProvider_id: objectId.required(),
  diagnosis: Joi.string().trim().min(1).required(),
  code: Joi.string().trim().min(1).required(),
  type: Joi.string().valid("Primary", "Secondary", "Differential", "Working"),
  status: Joi.string().valid("Active", "Resolved", "Chronic", "Provisional"),
  date: Joi.date(),
  notes: Joi.string().trim().allow("", null),
});

export const updateDiagnosisSchema = toUpdate(createDiagnosisSchema);

// --- medication -------------------------------------------------------

export const createMedicationSchema = Joi.object({
  medication: Joi.string().trim().min(1).required(),
  dosage: Joi.string().trim().min(1).required(),
  frequency: Joi.string().trim().min(1).required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref("startDate")).required().messages({
    "date.greater": "endDate must be after startDate",
  }),
  status: Joi.string().valid("Active", "Completed", "Discontinued", "Pending"),
  duration: Joi.string().trim().allow("", null),
  prescribedBy: objectId.required(),
  patientId: objectId.required(),
  visitId: objectId.required(),
  notes: Joi.string().trim().allow("", null),
});

// Hand-written rather than forked: `endDate.greater(ref("startDate"))`
// cannot resolve on a PATCH that omits startDate.
export const updateMedicationSchema = toUpdate(
  Joi.object({
    medication: Joi.string().trim().min(1),
    dosage: Joi.string().trim().min(1),
    frequency: Joi.string().trim().min(1),
    startDate: Joi.date(),
    endDate: Joi.date(),
    status: Joi.string().valid(
      "Active",
      "Completed",
      "Discontinued",
      "Pending",
    ),
    duration: Joi.string().trim().allow("", null),
    prescribedBy: objectId,
    patientId: objectId,
    visitId: objectId,
    notes: Joi.string().trim().allow("", null),
  }),
);

// --- test -------------------------------------------------------------

export const createTestSchema = Joi.object({
  testName: Joi.string().trim().min(1).required(),
  visit_id: objectId.required(),
  ordered_by: objectId.required(),
  status: Joi.string().valid("Ordered", "Pending", "Completed", "Cancelled"),
  result: Joi.string().trim().allow("", null),
  dateOrdered: Joi.date(),
});

export const updateTestSchema = toUpdate(createTestSchema);

// --- treatment --------------------------------------------------------

export const createTreatmentSchema = Joi.object({
  visitId: objectId.required(),
  medicalProvider_id: objectId.required(),
  name: Joi.string().trim().min(1).required(),
  type: Joi.string().valid("Procedure", "Periodic", "Wholesome", "Other"),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref("startDate")).required().messages({
    "date.greater": "endDate must be after startDate",
  }),
  status: Joi.string().valid("Scheduled", "Ongoing", "Completed", "Cancelled"),
  priority: Joi.string().valid("Low", "Medium", "High", "Urgent"),
  progress: Joi.number().min(0).max(100).messages({
    "number.min": "progress must be between 0 and 100",
    "number.max": "progress must be between 0 and 100",
  }),
  isRecommended: Joi.boolean(),
  notes: Joi.string().trim().allow("", null),
});

// Same ref caveat as medications.
export const updateTreatmentSchema = toUpdate(
  Joi.object({
    visitId: objectId,
    medicalProvider_id: objectId,
    name: Joi.string().trim().min(1),
    type: Joi.string().valid("Procedure", "Periodic", "Wholesome", "Other"),
    startDate: Joi.date(),
    endDate: Joi.date(),
    status: Joi.string().valid(
      "Scheduled",
      "Ongoing",
      "Completed",
      "Cancelled",
    ),
    priority: Joi.string().valid("Low", "Medium", "High", "Urgent"),
    progress: Joi.number().min(0).max(100),
    isRecommended: Joi.boolean(),
    notes: Joi.string().trim().allow("", null),
  }),
);

// --- invoice ----------------------------------------------------------

export const createInvoiceSchema = Joi.object({
  visitId: objectId.required(),
  service_charged: Joi.string().trim().min(1).required(),
  invoiceNumber: Joi.string().trim().min(1).required(),
  amount: Joi.number().min(0).required().messages({
    "number.min": "amount cannot be negative",
  }),
  copayAmount: Joi.number().min(0).required().messages({
    "number.min": "copayAmount cannot be negative",
  }),
  payment_mode: Joi.string().valid("COPAY", "INSURANCE", "SELF"),
  status: Joi.string().valid("PAID", "UNPAID", "PENDING INSURANCE REVIEW"),
  description: Joi.string().trim().allow("", null),
  notes: Joi.string().trim().allow("", null),
});

export const updateInvoiceSchema = toUpdate(createInvoiceSchema);

// --- insurance --------------------------------------------------------

const contactSchema = Joi.object({
  phone: Joi.string().trim().allow("", null),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .allow("", null),
  website: Joi.string().trim().allow("", null),
  address: Joi.string().trim().allow("", null),
});

export const createInsurerSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  panel: Joi.string()
    .valid("Tier I", "Tier II", "Tier III", "Tier IV")
    .required(),
  status: Joi.string().trim().allow("", null),
  payerId: Joi.string().trim().allow("", null),
  contact: contactSchema,
  agent: Joi.object({
    name: Joi.string().trim().allow("", null),
    phone: Joi.string().trim().allow("", null),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .allow("", null),
  }),
});

export const updateInsurerSchema = toUpdate(createInsurerSchema);

export const createBenefitPlanSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  insurerId: objectId.required(),
  description: Joi.string().trim().allow("", null),
  coverageType: Joi.string().valid("HMO", "PPO", "EPO", "POS"),
  // Mixed in the model -- deliberately unconstrained, but declared so
  // stripUnknown does not discard it.
  coverageDetails: Joi.any(),
  costSharing: Joi.any(),
  outOfPocketMax: Joi.object({
    individual: Joi.number().min(0),
    family: Joi.number().min(0),
  }),
  coveredServices: Joi.array().items(Joi.string().trim()),
  exclusions: Joi.array().items(Joi.string().trim()),
});

export const updateBenefitPlanSchema = toUpdate(createBenefitPlanSchema);

export const createPolicySchema = Joi.object({
  patientId: objectId.required(),
  benefitPlanId: objectId.required(),
  policyNumber: Joi.string().trim().min(1).required(),
  effectiveDate: Joi.date().required(),
  expiryDate: Joi.date().greater(Joi.ref("effectiveDate")).messages({
    "date.greater": "expiryDate must be after effectiveDate",
  }),
  coverageType: Joi.string().valid("Primary", "Secondary", "Tertiary"),
  memberId: Joi.string().trim().allow("", null),
  isActive: Joi.boolean(),
});

// Same ref caveat as medications.
export const updatePolicySchema = toUpdate(
  Joi.object({
    patientId: objectId,
    benefitPlanId: objectId,
    policyNumber: Joi.string().trim().min(1),
    effectiveDate: Joi.date(),
    expiryDate: Joi.date(),
    coverageType: Joi.string().valid("Primary", "Secondary", "Tertiary"),
    memberId: Joi.string().trim().allow("", null),
    isActive: Joi.boolean(),
  }),
);

// --- notification -----------------------------------------------------

export const createNotificationSchema = Joi.object({
  message: Joi.string().trim().min(1).required(),
  // Mirrors the enum on the Notification model. The model defaults to
  // "info" as well, but declaring it here means the handler receives a
  // type on every request instead of relying on a destructuring default.
  type: Joi.string()
    .valid("info", "success", "warning", "error")
    .default("info"),
});

// --- shared route params ---------------------------------------------

export const idParamSchema = Joi.object({
  id: objectId.required(),
}).unknown(true);
