import {
  create,
  single,
  deleteVital,
  getAll,
  update,
  getVitalsByPatient,
  getVitalsByVisit,
  getDefinitions,
} from "../../controllers/vitalController";
import { Router } from "express";
import { protect } from "../../middleware/authMiddleware";
import {
  requireClinicalNotesRead,
  requireClinicalNotesWrite,
  requireClinicalNotesCreate,
  requireClinicalNotesDelete,
} from "../../middleware/authorizationMiddleware";

import { validate } from "../../middleware/validate";
import { createVitalSchema, updateVitalSchema } from "../../schemas";
const router = Router();

// Apply authentication middleware to all routes
router.use(protect);

// Authoritative unit/reference-range table for vital signs. Static
// reference data, not patient-specific -- any authenticated user (or
// future service account) can read it, so it isn't gated behind the
// clinical-notes ABAC permission the way patient vitals are below.
// Registered before "/:id" so it isn't swallowed as an id param.
router.get("/definitions", getDefinitions);

// Retrieve all vitals
router.get("/", requireClinicalNotesRead, getAll);

// Create a new vital
router.post(
  "/",
  requireClinicalNotesCreate,
  validate(createVitalSchema),
  create,
);

// Retrieve a single vital with id
router.get("/:id", requireClinicalNotesRead, single);

// Update a vital with id
router.patch(
  "/:id",
  requireClinicalNotesWrite,
  validate(updateVitalSchema),
  update,
);

// Delete a vital with id
router.delete("/:id", requireClinicalNotesDelete, deleteVital);

// Fetch a patient's vitals
router.get("/patient/:patientId", requireClinicalNotesRead, getVitalsByPatient);

// Fetch vitals by visit id
router.get("/visit/:visitId", requireClinicalNotesRead, getVitalsByVisit);

export default router;
