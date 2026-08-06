import { Router } from "express";
import {
  create,
  getAll,
  update,
  single,
  deleteFinancial,
} from "../../controllers/financialController";
import { protect } from "../../middleware/authMiddleware";
import {
  requireBillingRead,
  requireBillingWrite,
  requireBillingCreate,
  requireBillingDelete,
} from "../../middleware/authorizationMiddleware";

const router = Router();

// Apply authentication middleware to all routes
router.use(protect);

// Retrieve all financials
router.get("/", requireBillingRead, getAll);

// Create a new financial
router.post("/", requireBillingCreate, create);

// Retrieve a single financial with id
router.get("/:id", requireBillingRead, single);

// Update a financial with id
router.patch("/:id", requireBillingWrite, update);

// Delete a financial with id
router.delete("/:id", requireBillingDelete, deleteFinancial);

export default router;
