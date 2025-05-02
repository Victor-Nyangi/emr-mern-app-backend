import mongoose from "mongoose";

const benefitPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    insurerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Insurer",
      required: true,
      index: true, // For efficient querying of plans by insurer
    },
    coverageType: {
      type: String,
      enum: ["HMO", "PPO", "EPO", "POS"],
    },
    coverageDetails: {
      type: mongoose.Schema.Types.Mixed, // Allows for flexible coverage details as a JSON object
    },
    costSharing: {
      type: mongoose.Schema.Types.Mixed, // Allows for flexible cost sharing details
    },
    outOfPocketMax: {
      individual: Number,
      family: Number,
    },
    coveredServices: [String],
    exclusions: [String],
  },
  {
    timestamps: true,
  }
);

const BenefitPlan = mongoose.model("BenefitPlan", benefitPlanSchema);
export default BenefitPlan;
