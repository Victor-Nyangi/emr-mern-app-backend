import {
  create,
  single,
  deletePolicy,
  getAll,
  update,
} from "../../../controllers/insurance/policyController";
import { Router } from "express";
import { protect } from "../../../middleware/authMiddleware";
import {
  requireBillingRead,
  requireBillingWrite,
  requireBillingCreate,
  requireBillingDelete,
} from "../../../middleware/authorizationMiddleware";

const router = Router();

// Apply authentication middleware to all routes
router.use(protect);

// Retrieve all policies
router.get("/", requireBillingRead, getAll);

// Create a new policy
router.post("/", requireBillingCreate, create);

// Retrieve a single policy with id
router.get("/:id", requireBillingRead, single);

// Update a policy with id
router.patch("/:id", requireBillingWrite, update);

// Delete a policy with id
router.delete("/:id", requireBillingDelete, deletePolicy);

export default router;
