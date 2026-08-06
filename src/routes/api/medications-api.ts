import {
  create,
  single,
  deleteMedication,
  getAll,
  update,
  getMedicationsByVisit,
  getMedicationsByPatient,
} from "../../controllers/medicationController";

import { Router } from "express";
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

// Retrieve all medications
router.get("/", requireClinicalNotesRead, getAll);

// Create a new medication
router.post("/", requireClinicalNotesCreate, create);

// Retrieve a single medication with id
router.get("/:id", requireClinicalNotesRead, single);

// Update a medication with id
router.patch("/:id", requireClinicalNotesWrite, update);

// Delete a medication with id
router.delete("/:id", requireClinicalNotesDelete, deleteMedication);

// Fetch medication by visit id
router.get("/visit/:visitId", requireClinicalNotesRead, getMedicationsByVisit);

// Fetch medication by patient id
router.get(
  "/patient/:patientId",
  requireClinicalNotesRead,
  getMedicationsByPatient,
);

export default router;
