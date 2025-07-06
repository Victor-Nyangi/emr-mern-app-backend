import {
  create,
  single,
  deleteInsurer,
  getAll,
  update,
} from "../../../controllers/insurance/insurerController";
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

// Retrieve all insurance firms
router.get("/", requireBillingRead, getAll);

// Create a new insurance firm
router.post("/", requireBillingCreate, create);

// Retrieve a single insurance firm with id
router.get("/:id", requireBillingRead, single);

// Update a insurance firm with id
router.patch("/:id", requireBillingWrite, update);

// Delete a insurance firm with id
router.delete("/:id", requireBillingDelete, deleteInsurer);

export default router;
