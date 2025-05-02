import { model, Schema } from "mongoose";

const policySchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true, // For efficient querying of policies by patient
    },
    benefitPlanId: {
      type: Schema.Types.ObjectId,
      ref: "BenefitPlan",
      required: true,
      index: true, // For efficient querying of policies by plan
    }, // like groupNumber, insurance plan
    policyNumber: {
      type: String,
      required: true,
      unique: true, // Assuming policy numbers are unique
    },
    coverageType: {
      type: String,
      enum: ["Primary", "Secondary", "Tertiary"],
      default: "Primary",
    },
    effectiveDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
    },
    memberId: {
      type: String,
    }, // For anonymity
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const PatientInsurance = model("PatientInsurance", policySchema);
export default PatientInsurance;
