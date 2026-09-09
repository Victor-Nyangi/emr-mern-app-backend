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
import { validate } from "../../middleware/validate";
import { createDrugSchema, updateDrugSchema } from "../../schemas";
const router = Router();

// Apply authentication middleware to all routes
router.use(protect);

// Retrieve all drugs
router.get("/", requireClinicalNotesRead, getAll);

// Create a new drug
router.post(
  "/",
  requireClinicalNotesCreate,
  validate(createDrugSchema),
  create,
);

// Retrieve a single drug with id
router.get("/:id", requireClinicalNotesRead, single);

// Update a drug with id
router.patch(
  "/:id",
  requireClinicalNotesWrite,
  validate(updateDrugSchema),
  update,
);

// Delete a drug with id
router.delete("/:id", requireClinicalNotesDelete, deleteDrug);

export default router;
