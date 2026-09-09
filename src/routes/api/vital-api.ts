import {
  create,
  single,
  deleteVital,
  getAll,
  update,
  getVitalsByPatient,
  getVitalsByVisit,
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
