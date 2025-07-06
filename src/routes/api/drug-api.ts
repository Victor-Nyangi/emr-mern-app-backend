import { Router } from "express";

import {
  create,
  getAll,
  single,
  update,
  deleteDrug,
} from "../../controllers/drugController";
import { protect } from "../../middleware/authMiddleware";
import {
  requireClinicalNotesRead,
  requireClinicalNotesWrite,
  requireClinicalNotesCreate,
  requireClinicalNotesDelete,
} from "../../middleware/authorizationMiddleware";
const router = Router();

// Apply authentication middleware to all routes
router.use(protect);

// Retrieve all drugs
router.get("/", requireClinicalNotesRead, getAll);

// Create a new drug
router.post("/", requireClinicalNotesCreate, create);

// Retrieve a single drug with id
router.get("/:id", requireClinicalNotesRead, single);

// Update a drug with id
router.patch("/:id", requireClinicalNotesWrite, update);

// Delete a drug with id
router.delete("/:id", requireClinicalNotesDelete, deleteDrug);

export default router;
