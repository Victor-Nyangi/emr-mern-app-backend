import {
  create,
  single,
  deleteDiagnosis,
  getAll,
  update,
  getDiagnosesByVisit,
} from "../../controllers/diagnosisController";

import { Router } from "express";
import { protect } from "../../middleware/authMiddleware";
import {
  requireClinicalNotesRead,
  requireClinicalNotesWrite,
  requireClinicalNotesCreate,
  requireClinicalNotesDelete,
} from "../../middleware/authorizationMiddleware";

import { validate } from "../../middleware/validate";
import { createDiagnosisSchema, updateDiagnosisSchema } from "../../schemas";
const router = Router();

// Apply authentication middleware to all routes
router.use(protect);

// Retrieve all diagnoses
router.get("/", requireClinicalNotesRead, getAll);

// Create a new diagnosis
router.post(
  "/",
  requireClinicalNotesCreate,
  validate(createDiagnosisSchema),
  create,
);

// Retrieve a single diagnosis with id
router.get("/:id", requireClinicalNotesRead, single);

// Update a diagnosis with id
router.patch(
  "/:id",
  requireClinicalNotesWrite,
  validate(updateDiagnosisSchema),
  update,
);

// Delete a diagnosis with id
router.delete("/:id", requireClinicalNotesDelete, deleteDiagnosis);

// Fetch diagnosis by visit id
router.get("/visit/:visitId", requireClinicalNotesRead, getDiagnosesByVisit);

export default router;
