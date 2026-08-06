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

// --- shared route params ---------------------------------------------

export const idParamSchema = Joi.object({
  id: objectId.required(),
}).unknown(true);
