import {
  create,
  single,
  getAll,
  update,
  deleteTreatment,
  getTreatmentsByVisit,
} from "../../../controllers/visit/treatmentController";

import { Router } from "express";
import { protect } from "../../../middleware/authMiddleware";
import {
  requireClinicalNotesRead,
  requireClinicalNotesWrite,
  requireClinicalNotesCreate,
  requireClinicalNotesDelete,
} from "../../../middleware/authorizationMiddleware";

import { validate } from "../../../middleware/validate";
import { createTreatmentSchema, updateTreatmentSchema } from "../../../schemas";
const router = Router();

// Apply authentication middleware to all routes
router.use(protect);

// Retrieve all treatments
router.get("/", requireClinicalNotesRead, getAll);

// Create a new treatment
router.post(
  "/",
  requireClinicalNotesCreate,
  validate(createTreatmentSchema),
  create,
);

// Retrieve a single treatment with id
router.get("/:id", requireClinicalNotesRead, single);

// Update a treatment with id
router.patch(
  "/:id",
  requireClinicalNotesWrite,
  validate(updateTreatmentSchema),
  update,
);

// Delete a treatment with id
router.delete("/:id", requireClinicalNotesDelete, deleteTreatment);

// Fetch treatment by visit id
router.get("/visit/:visitId", requireClinicalNotesRead, getTreatmentsByVisit);
export default router;
