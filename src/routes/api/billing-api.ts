import {
  create,
  single,
  deleteBilling,
  getAll,
  update,
} from "../../controllers/billingController";
import { Router } from "express";
import { protect } from "../../middleware/authMiddleware";
import {
  requireBillingRead,
  requireBillingWrite,
  requireBillingCreate,
  requireBillingDelete,
} from "../../middleware/authorizationMiddleware";

import { validate } from "../../middleware/validate";
import { createBillingSchema, updateBillingSchema } from "../../schemas";
const router = Router();

// Apply authentication middleware to all routes
router.use(protect);

// Retrieve all billings
router.get("/", requireBillingRead, getAll);

// Create a new billing
router.post("/", requireBillingCreate, validate(createBillingSchema), create);

// Retrieve a single billing with id
router.get("/:id", requireBillingRead, single);

// Update a billing with id
router.patch(
  "/:id",
  requireBillingWrite,
  validate(updateBillingSchema),
  update,
);

// Delete a billing with id
router.delete("/:id", requireBillingDelete, deleteBilling);

export default router;
