import {
  create,
  single,
  deleteBenefitPlan,
  getAll,
  update,
  getPoliciesByBenefitPlan,
} from "../../../controllers/insurance/benefitPlanController";
import { Router } from "express";
import { protect } from "../../../middleware/authMiddleware";
import {
  requireBillingRead,
  requireBillingWrite,
  requireBillingCreate,
  requireBillingDelete,
} from "../../../middleware/authorizationMiddleware";

import { validate } from "../../../middleware/validate";
import {
  createBenefitPlanSchema,
  updateBenefitPlanSchema,
} from "../../../schemas";
const router = Router();

// Apply authentication middleware to all routes
router.use(protect);

// Retrieve all benefit plans
router.get("/", requireBillingRead, getAll);

// Create a new benefit plan
router.post(
  "/",
  requireBillingCreate,
  validate(createBenefitPlanSchema),
  create,
);

// Retrieve a single benefit plan with id
router.get("/:id", requireBillingRead, single);

// Update a benefit plan with id
router.patch(
  "/:id",
  requireBillingWrite,
  validate(updateBenefitPlanSchema),
  update,
);

// Delete a benefit plan with id
router.delete("/:id", requireBillingDelete, deleteBenefitPlan);

// Get policies for a specific benefit Plan
router.get(
  "/:benefitPlanId/policies",
  requireBillingRead,
  getPoliciesByBenefitPlan,
);

export default router;
